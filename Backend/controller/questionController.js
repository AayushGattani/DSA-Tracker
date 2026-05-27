import Question from '../models/Question.js';
import Revision from '../models/Revision.js';
import User from '../models/User.js';
import { calculateRevisionDates, normalizeDate, getDayBounds } from '../utils/dateHelpers.js';

// Add a new question
export const addQuestion = async (req, res) => {
  try {
    const { title, notes, link, solvedDate } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Question title is required.'
      });
    }

    if (!solvedDate) {
      return res.status(400).json({
        success: false,
        message: 'Solved date is required.'
      });
    }

    // Create question
    const question = await Question.create({
      userId,
      title,
      notes: notes || '',
      link: link || null,
      solvedDate: normalizeDate(solvedDate)
    });

    // Get user's reminder pattern
    const user = await User.findById(userId);
    const reminderDays = user.getReminderDays();

    // Calculate revision dates
    const revisionDates = calculateRevisionDates(solvedDate, reminderDays);

    // Create revision entries
    const revisionEntries = revisionDates.map(({ date, dayOffset }) => ({
      userId,
      questionId: question._id,
      revisionDate: date,
      dayOffset,
      status: 'pending'
    }));

    await Revision.insertMany(revisionEntries);

    res.status(201).json({
      success: true,
      message: 'Question added successfully.',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding question.',
      error: error.message
    });
  }
};

// Get all questions for a user
export const getAllQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, page = 1, limit = 50 } = req.query;

    // Build query
    const query = { userId };

    if (startDate || endDate) {
      query.solvedDate = {};
      if (startDate) {
        query.solvedDate.$gte = normalizeDate(startDate);
      }
      if (endDate) {
        const end = normalizeDate(endDate);
        end.setHours(23, 59, 59, 999);
        query.solvedDate.$lte = end;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .sort({ solvedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        questions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions.',
      error: error.message
    });
  }
};

// Get a single question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const question = await Question.findOne({ _id: id, userId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    // Get revision history for this question
    const revisions = await Revision.find({ questionId: id, userId })
      .sort({ revisionDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        question,
        revisions
      }
    });
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question.',
      error: error.message
    });
  }
};

// Update a question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, notes, link } = req.body;

    const question = await Question.findOne({ _id: id, userId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    // Update fields
    if (title) question.title = title;
    if (notes !== undefined) question.notes = notes;
    if (link !== undefined) question.link = link || null;

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully.',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question.',
      error: error.message
    });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const question = await Question.findOneAndDelete({ _id: id, userId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    // Delete associated revisions
    await Revision.deleteMany({ questionId: id, userId });

    res.status(200).json({
      success: true,
      message: 'Question and associated revisions deleted successfully.'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question.',
      error: error.message
    });
  }
};

// Get statistics
export const getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalQuestions = await Question.countDocuments({ userId });
    const totalRevisions = await Revision.countDocuments({ userId, status: 'revised' });
    const pendingRevisions = await Revision.countDocuments({ userId, status: 'pending' });

    // Get today's stats
    const today = getDayBounds(new Date());
    const todayQuestions = await Question.countDocuments({
      userId,
      solvedDate: { $gte: today.start, $lte: today.end }
    });

    const todayRevisions = await Revision.countDocuments({
      userId,
      revisionDate: { $gte: today.start, $lte: today.end }
    });

    const todayRevisionsCompleted = await Revision.countDocuments({
      userId,
      revisionDate: { $gte: today.start, $lte: today.end },
      status: 'revised'
    });

    res.status(200).json({
      success: true,
      data: {
        totalQuestions,
        totalRevisions,
        pendingRevisions,
        today: {
          questions: todayQuestions,
          totalRevisions: todayRevisions,
          completedRevisions: todayRevisionsCompleted,
          pendingRevisions: todayRevisions - todayRevisionsCompleted
        }
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics.',
      error: error.message
    });
  }
};
