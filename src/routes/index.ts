// src/routes/index.ts
import { Router } from 'express';
import projectRoutes from './projectRoutes';
import aiRoutes from './aiRoutes';
import exportRoutes from './exportRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Auth routes (public)
router.use('/auth', authRoutes);

// API routes
router.use('/projects', projectRoutes);
router.use('/ai', aiRoutes);
router.use('/export', exportRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'AI Code Generation Platform API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;