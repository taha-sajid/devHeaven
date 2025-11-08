
// src/controllers/ExportController.ts
import { Request, Response } from 'express';
import * as ExportService from '../services/ExportService';
import * as FileModel from '../models/FileModel';
import * as ProjectModel from '../models/ProjectModel';
import { ApiResponse } from '../types';

export const exportProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareUrl } = req.params;

    const project = await ProjectModel.findProjectByShareUrl(shareUrl);
    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      } as ApiResponse);
      return;
    }

    const files = await FileModel.findFilesByProjectId(project.id);

    const zipBuffer = await ExportService.exportAsZip(files, project.title);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip"`);
    res.send(zipBuffer);
  } catch (error: any) {
    console.error('Error exporting project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export project',
    } as ApiResponse);
  }
};