// src/controllers/ProjectController.ts
import { Request, Response } from 'express';
import * as ProjectService from '../services/ProjectService';
import { ApiResponse, CreateProjectRequest } from '../types';


// Update ProjectController to include user_id
// src/controllers/ProjectController.ts (Add this function)
export const listUserProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
      } as ApiResponse);
      return;
    }

    const { limit = 50, offset = 0 } = req.query;

    const projects = await ProjectService.listUserProjects(
      req.userId,
      Number(limit),
      Number(offset)
    );

    res.json({
      success: true,
      data: projects,
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error listing projects:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list projects',
    } as ApiResponse);
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, title, description }: CreateProjectRequest = req.body;

    if (!prompt || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required',
      } as ApiResponse);
      return;
    }

    const result = await ProjectService.createProject({
      prompt,
      title,
      description,
    },
      req.userId!,
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Project created successfully',
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create project',
    } as ApiResponse);
  }
};

export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareUrl } = req.params;

    const result = await ProjectService.getProject(shareUrl);

    if (!result) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: result,
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch project',
    } as ApiResponse);
  }
};

export const updateFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        error: 'Content is required',
      } as ApiResponse);
      return;
    }

    const file = await ProjectService.updateProjectFile(fileId, content, req.userId!);

    res.json({
      success: true,
      data: file,
      message: 'File updated successfully',
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update file',
    } as ApiResponse);
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    await ProjectService.deleteProjectById(projectId, req.userId!);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    } as ApiResponse);
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete project',
    } as ApiResponse);
  }
};
