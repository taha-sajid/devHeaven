
// src/controllers/AIController.ts (Updated)
import { Request, Response } from 'express';
import * as AIService from '../services/AIService';
import { GenerateCodeRequest, ApiResponse } from '../types';

export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = AIService.getAvailableConfig();
    res.json({
      success: true,
      data: config,
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error getting config:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get configuration',
    } as ApiResponse);
  }
};

export const generateCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, context, model, provider }: GenerateCodeRequest = req.body;

    if (!prompt || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required',
      } as ApiResponse);
      return;
    }

    const result = await AIService.generateCode({
      prompt,
      context,
      model,
      provider,
    });

    res.json({
      success: true,
      data: result,
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error generating code:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate code',
    } as ApiResponse);
  }
};

export const generateCodeStream = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, context, model, provider }: GenerateCodeRequest = req.body;

    if (!prompt || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required',
      } as ApiResponse);
      return;
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial event
    res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

    // Stream the response
    for await (const chunk of AIService.generateCodeStream({
      prompt,
      context,
      model,
      provider,
    })) {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error streaming code:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
};