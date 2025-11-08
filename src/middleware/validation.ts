
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const validateCreateProject = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Valid prompt is required',
    } as ApiResponse);
    return;
  }

  if (prompt.length > 5000) {
    res.status(400).json({
      success: false,
      error: 'Prompt is too long (max 5000 characters)',
    } as ApiResponse);
    return;
  }

  next();
};

export const validateGenerateCode = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Valid prompt is required',
    } as ApiResponse);
    return;
  }

  if (prompt.length > 5000) {
    res.status(400).json({
      success: false,
      error: 'Prompt is too long (max 5000 characters)',
    } as ApiResponse);
    return;
  }

  next();
};
