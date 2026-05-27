import express from 'express';
import {
  getTodayRevisions,
  getRevisionsByDate,
  getUpcomingRevisions,
  markRevisionCompleted,
  markMultipleRevisionsCompleted,
  resetRevision,
  getQuestionRevisionHistory
} from '../controller/revisionController.js';
import { authenticate } from '../utils/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Revision routes
router.get('/today', getTodayRevisions);
router.get('/upcoming', getUpcomingRevisions);
router.get('/by-date', getRevisionsByDate);
router.get('/question/:questionId', getQuestionRevisionHistory);

router.patch('/:id/complete', markRevisionCompleted);
router.patch('/complete-multiple', markMultipleRevisionsCompleted);
router.patch('/:id/reset', resetRevision);

export default router;
