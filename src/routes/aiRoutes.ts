import { Router } from 'express';
import * as AIController from '../controllers/AIController';
import { validateGenerateCode } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get available providers and models
router.get('/config', AIController.getConfig);

// Protected routes (require authentication)
router.post('/generate', authenticate, validateGenerateCode, AIController.generateCode);
router.post('/generate/stream', authenticate, validateGenerateCode, AIController.generateCodeStream);

export default router;