import express from 'express';
import {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getStatistics
} from '../controller/questionController.js';
import { authenticate } from '../utils/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Question routes
router.post('/', addQuestion);

router.get('/', getAllQuestions);
router.get('/statistics', getStatistics);
router.get('/:id', getQuestionById);

router.put('/:id', updateQuestion);

router.delete('/:id', deleteQuestion);

export default router;
