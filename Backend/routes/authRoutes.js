import express from 'express';
import { signup, login, getProfile } from '../controller/authController.js';
import { authenticate } from '../utils/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
