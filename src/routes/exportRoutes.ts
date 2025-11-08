// src/routes/exportRoutes.ts (Updated with auth)
import { Router } from 'express';
import * as ExportController from '../controllers/ExportController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Public route (with optional auth for ownership check)
router.get('/:shareUrl', optionalAuth, ExportController.exportProject);

export default router;
