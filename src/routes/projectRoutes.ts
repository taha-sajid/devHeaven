// src/routes/projectRoutes.ts (Updated with auth)
import { Router } from 'express';
import * as ProjectController from '../controllers/ProjectController';
import { validateCreateProject } from '../middleware/validation';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// Protected routes (require authentication)
router.post('/', authenticate, validateCreateProject, ProjectController.createProject);
router.put('/files/:fileId', authenticate, ProjectController.updateFile);
router.delete('/:projectId', authenticate, ProjectController.deleteProject);

// Public routes (with optional auth)
router.get('/:shareUrl', optionalAuth, ProjectController.getProject);

// List user's projects (protected)
router.get('/', authenticate, ProjectController.listUserProjects);

export default router;