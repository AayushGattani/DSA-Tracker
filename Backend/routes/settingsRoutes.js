import express from 'express';
import {
  getSettings,
  updateReminderPattern,
  updateProfile,
  getStreak,
  getContributionGraph
} from '../controller/settingsController.js';
import { authenticate } from '../utils/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Settings routes
router.get('/', getSettings);
router.patch('/reminder-pattern', updateReminderPattern);
router.patch('/profile', updateProfile);
router.get('/streak', getStreak);
router.get('/contribution-graph', getContributionGraph);

export default router;
