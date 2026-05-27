import User from '../models/User.js';
import Question from '../models/Question.js';
import Revision from '../models/Revision.js';
import { calculateRevisionDates, normalizeDate } from '../utils/dateHelpers.js';

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('reminderPattern');

    res.status(200).json({
      success: true,
      data: {
        reminderPattern: user.reminderPattern,
        reminderDays: user.getReminderDays()
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings.',
      error: error.message
    });
  }
};

// Update reminder pattern with options
export const updateReminderPattern = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reminderPattern, applyOption, customDate } = req.body;

    if (!reminderPattern) {
      return res.status(400).json({
        success: false,
        message: 'Reminder pattern is required.'
      });
    }

    if (!applyOption) {
      return res.status(400).json({
        success: false,
        message: 'Apply option is required (future, today, beginning, custom).'
      });
    }

    // Validate pattern format (comma-separated numbers)
    const pattern = reminderPattern.trim();
    const days = pattern.split(',').map(d => d.trim());
    
    const isValid = days.every(day => {
      const num = parseInt(day);
      return !isNaN(num) && num > 0;
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reminder pattern. Please use comma-separated positive numbers (e.g., 1,3,7,14,21).'
      });
    }

    // Validate custom date if provided
    if (applyOption === 'custom' && !customDate) {
      return res.status(400).json({
        success: false,
        message: 'Custom date is required when apply option is "custom".'
      });
    }

    // Update user
    const user = await User.findById(userId);
    const oldPattern = user.reminderPattern;
    user.reminderPattern = pattern;
    await user.save();

    const reminderDays = user.getReminderDays();
    let message = '';
    let affectedQuestions = 0;

    // Handle different apply options
    if (applyOption === 'future') {
      message = 'Reminder pattern updated successfully. This will apply to future questions.';
    } else if (applyOption === 'today') {
      // Recreate revisions for questions solved today onwards
      const today = normalizeDate(new Date());
      const questions = await Question.find({
        userId,
        solvedDate: { $gte: today }
      });

      for (const question of questions) {
        // Delete existing revisions for these questions
        await Revision.deleteMany({ userId, questionId: question._id });

        // Create new revisions with new pattern
        const revisionDates = calculateRevisionDates(question.solvedDate, reminderDays);
        const revisionEntries = revisionDates.map(({ date, dayOffset }) => ({
          userId,
          questionId: question._id,
          revisionDate: date,
          dayOffset,
          status: 'pending'
        }));
        await Revision.insertMany(revisionEntries);
      }

      affectedQuestions = questions.length;
      message = `Reminder pattern updated and applied to ${affectedQuestions} question(s) from today onwards.`;
    } else if (applyOption === 'beginning') {
      // Recreate revisions for ALL questions
      const questions = await Question.find({ userId });

      for (const question of questions) {
        // Delete existing revisions
        await Revision.deleteMany({ userId, questionId: question._id });

        // Create new revisions with new pattern
        const revisionDates = calculateRevisionDates(question.solvedDate, reminderDays);
        const revisionEntries = revisionDates.map(({ date, dayOffset }) => ({
          userId,
          questionId: question._id,
          revisionDate: date,
          dayOffset,
          status: 'pending'
        }));
        await Revision.insertMany(revisionEntries);
      }

      affectedQuestions = questions.length;
      message = `Reminder pattern updated and applied to all ${affectedQuestions} question(s) from the beginning.`;
    } else if (applyOption === 'custom') {
      // Recreate revisions for questions solved on or after custom date
      const fromDate = normalizeDate(new Date(customDate));
      const questions = await Question.find({
        userId,
        solvedDate: { $gte: fromDate }
      });

      for (const question of questions) {
        // Delete existing revisions for these questions
        await Revision.deleteMany({ userId, questionId: question._id });

        // Create new revisions with new pattern
        const revisionDates = calculateRevisionDates(question.solvedDate, reminderDays);
        const revisionEntries = revisionDates.map(({ date, dayOffset }) => ({
          userId,
          questionId: question._id,
          revisionDate: date,
          dayOffset,
          status: 'pending'
        }));
        await Revision.insertMany(revisionEntries);
      }

      affectedQuestions = questions.length;
      message = `Reminder pattern updated and applied to ${affectedQuestions} question(s) from ${new Date(customDate).toLocaleDateString()}.`;
    }

    res.status(200).json({
      success: true,
      message,
      data: {
        reminderPattern: user.reminderPattern,
        reminderDays: user.getReminderDays(),
        affectedQuestions
      }
    });
  } catch (error) {
    console.error('Update reminder pattern error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder pattern.',
      error: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required.'
      });
    }

    const user = await User.findById(userId);
    user.name = name;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          reminderPattern: user.reminderPattern
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile.',
      error: error.message
    });
  }
};

// Get streak information
export const getStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all questions with solved dates
    const questions = await Question.find({ userId }).select('solvedDate').sort({ solvedDate: 1 });
    
    if (questions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          currentStreak: 0,
          maxStreak: 0,
          totalQuestions: 0,
          totalActiveDays: 0
        }
      });
    }

    // Get unique dates
    const uniqueDates = [...new Set(questions.map(q => normalizeDate(q.solvedDate).getTime()))];
    uniqueDates.sort((a, b) => a - b);

    // Calculate streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 1;
    const today = normalizeDate(new Date()).getTime();
    const yesterday = today - 24 * 60 * 60 * 1000;

    // Check if there's activity today or yesterday
    const lastActiveDate = uniqueDates[uniqueDates.length - 1];
    if (lastActiveDate === today || lastActiveDate === yesterday) {
      // Calculate current streak backwards from last active date
      let currentDate = lastActiveDate;
      currentStreak = 1;
      
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const prevDate = uniqueDates[i];
        const expectedPrevDate = currentDate - 24 * 60 * 60 * 1000;
        
        if (prevDate === expectedPrevDate) {
          currentStreak++;
          currentDate = prevDate;
        } else {
          break;
        }
      }
    }

    // Calculate max streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = uniqueDates[i - 1];
      const currentDate = uniqueDates[i];
      const diff = currentDate - prevDate;
      const daysDiff = diff / (24 * 60 * 60 * 1000);

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    res.status(200).json({
      success: true,
      data: {
        currentStreak,
        maxStreak,
        totalQuestions: questions.length,
        totalActiveDays: uniqueDates.length
      }
    });
  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating streak.',
      error: error.message
    });
  }
};

// Get contribution graph data (365 days)
export const getContributionGraph = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get date range (last 365 days)
    const today = normalizeDate(new Date());
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // 365 days including today
    const normalizedStartDate = normalizeDate(startDate);

    // Get all questions in this range
    const questions = await Question.find({
      userId,
      solvedDate: { $gte: normalizedStartDate }
    }).select('solvedDate');

    // Count questions per date
    const dateCountMap = {};
    questions.forEach(q => {
      const dateKey = normalizeDate(q.solvedDate).toISOString().split('T')[0];
      dateCountMap[dateKey] = (dateCountMap[dateKey] || 0) + 1;
    });

    // Create array of 365 days with counts
    const contributionData = [];
    let currentDate = new Date(normalizedStartDate);
    
    for (let i = 0; i < 365; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      contributionData.push({
        date: dateKey,
        count: dateCountMap[dateKey] || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.status(200).json({
      success: true,
      data: contributionData
    });
  } catch (error) {
    console.error('Get contribution graph error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contribution graph data.',
      error: error.message
    });
  }
};
