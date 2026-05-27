import Revision from '../models/Revision.js';
import Question from '../models/Question.js';
import { getDayBounds, normalizeDate } from '../utils/dateHelpers.js';

// Get today's revisions
export const getTodayRevisions = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getDayBounds(new Date());

    const revisions = await Revision.find({
      userId,
      revisionDate: { $gte: today.start, $lte: today.end }
    })
      .populate('questionId')
      .sort({ status: 1, revisionDate: 1 }); // pending first, then by date

    res.status(200).json({
      success: true,
      data: {
        revisions,
        count: revisions.length
      }
    });
  } catch (error) {
    console.error('Get today revisions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s revisions.',
      error: error.message
    });
  }
};

// Get revisions for a specific date
export const getRevisionsByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required.'
      });
    }

    const dayBounds = getDayBounds(new Date(date));

    const revisions = await Revision.find({
      userId,
      revisionDate: { $gte: dayBounds.start, $lte: dayBounds.end }
    })
      .populate('questionId')
      .sort({ status: 1, revisionDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        revisions,
        count: revisions.length,
        date: dayBounds.start
      }
    });
  } catch (error) {
    console.error('Get revisions by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revisions.',
      error: error.message
    });
  }
};

// Get upcoming revisions
export const getUpcomingRevisions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;

    const today = normalizeDate(new Date());
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const revisions = await Revision.find({
      userId,
      revisionDate: { $gte: today, $lte: futureDate },
      status: 'pending'
    })
      .populate('questionId')
      .sort({ revisionDate: 1 });

    // Group by date
    const groupedByDate = revisions.reduce((acc, revision) => {
      const dateKey = revision.revisionDate.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(revision);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        revisions,
        groupedByDate,
        count: revisions.length
      }
    });
  } catch (error) {
    console.error('Get upcoming revisions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming revisions.',
      error: error.message
    });
  }
};

// Mark revision as completed
export const markRevisionCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const revision = await Revision.findOne({ _id: id, userId });

    if (!revision) {
      return res.status(404).json({
        success: false,
        message: 'Revision not found.'
      });
    }

    if (revision.status === 'revised') {
      return res.status(400).json({
        success: false,
        message: 'Revision already marked as completed.'
      });
    }

    revision.status = 'revised';
    revision.revisedAt = new Date();
    await revision.save();

    res.status(200).json({
      success: true,
      message: 'Revision marked as completed.',
      data: {
        revision
      }
    });
  } catch (error) {
    console.error('Mark revision completed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking revision as completed.',
      error: error.message
    });
  }
};

// Mark multiple revisions as completed
export const markMultipleRevisionsCompleted = async (req, res) => {
  try {
    const { revisionIds } = req.body;
    const userId = req.user._id;

    if (!revisionIds || !Array.isArray(revisionIds) || revisionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of revision IDs.'
      });
    }

    const result = await Revision.updateMany(
      {
        _id: { $in: revisionIds },
        userId,
        status: 'pending'
      },
      {
        $set: {
          status: 'revised',
          revisedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} revision(s) marked as completed.`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Mark multiple revisions completed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking revisions as completed.',
      error: error.message
    });
  }
};

// Reset revision status (mark as pending again)
export const resetRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const revision = await Revision.findOne({ _id: id, userId });

    if (!revision) {
      return res.status(404).json({
        success: false,
        message: 'Revision not found.'
      });
    }

    revision.status = 'pending';
    revision.revisedAt = null;
    await revision.save();

    res.status(200).json({
      success: true,
      message: 'Revision reset to pending.',
      data: {
        revision
      }
    });
  } catch (error) {
    console.error('Reset revision error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting revision.',
      error: error.message
    });
  }
};

// Get revision history for a specific question
export const getQuestionRevisionHistory = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;

    // Verify question belongs to user
    const question = await Question.findOne({ _id: questionId, userId });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.'
      });
    }

    const revisions = await Revision.find({ questionId, userId })
      .sort({ revisionDate: 1 });

    const stats = {
      total: revisions.length,
      completed: revisions.filter(r => r.status === 'revised').length,
      pending: revisions.filter(r => r.status === 'pending').length
    };

    res.status(200).json({
      success: true,
      data: {
        revisions,
        stats
      }
    });
  } catch (error) {
    console.error('Get question revision history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revision history.',
      error: error.message
    });
  }
};
