
// src/routes/authRoutes.ts
import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.updatePassword);

// Protected routes
router.post('/signout', authenticate, AuthController.signOut);
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;