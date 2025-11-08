// src/services/ProjectService.ts (Updated with userId)
import * as ProjectModel from '../models/ProjectModel';
import * as FileModel from '../models/FileModel';
import * as GenerationModel from '../models/GenerationModel';
import { generateCode } from './AIService';
import { CreateProjectRequest, Project, File } from '../types';

const generateTitleFromPrompt = (prompt: string): string => {
  const words = prompt.split(' ').slice(0, 5);
  return words.join(' ').substring(0, 50) + (words.length > 5 ? '...' : '');
};

export const createProject = async (
  request: CreateProjectRequest,
  userId: string
): Promise<{
  project: Project;
  files: File[];
}> => {
  const startTime = Date.now();

  // Generate code using AI
  const generationResult = await generateCode({
    prompt: request.prompt,
  });

  // Create project with user_id
  const project = await ProjectModel.createProject({
    title: request.title || generateTitleFromPrompt(request.prompt),
    description: request.description,
    prompt: request.prompt,
    user_id: userId,
  });

  // Create files - use 'name' property from generationResult.files
  const fileData = generationResult.files.map(f => ({
    project_id: project.id,
    filename: f.name,  // Changed from f.filename to f.name
    content: f.content,
    language: f.language,
  }));

  const files = await FileModel.createManyFiles(fileData);

  // Track generation
  const generationTime = Date.now() - startTime;
  await GenerationModel.createGeneration({
    project_id: project.id,
    prompt: request.prompt,
    model: 'claude-sonnet-4-20250514',
    generation_time_ms: generationTime,
  });

  return { project, files };
};

export const getProject = async (
  shareUrl: string,
  userId?: string
): Promise<{
  project: Project;
  files: File[];
  isOwner: boolean;
} | null> => {
  const project = await ProjectModel.findProjectByShareUrl(shareUrl);
  if (!project) return null;

  const files = await FileModel.findFilesByProjectId(project.id);
  const isOwner = userId ? project.user_id === userId : false;

  return { project, files, isOwner };
};

export const updateProjectFile = async (
  fileId: string,
  content: string,
  userId: string
): Promise<File> => {
  // Verify ownership
  const file = await FileModel.findFileById(fileId);
  if (!file) {
    throw new Error('File not found');
  }

  const project = await ProjectModel.findProjectById(file.project_id);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.user_id !== userId) {
    throw new Error('Unauthorized: You do not own this project');
  }

  return await FileModel.updateFile(fileId, { content });
};

export const deleteProjectById = async (
  projectId: string,
  userId: string
): Promise<void> => {
  // Verify ownership
  const project = await ProjectModel.findProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.user_id !== userId) {
    throw new Error('Unauthorized: You do not own this project');
  }

  await FileModel.deleteFilesByProjectId(projectId);
  await ProjectModel.deleteProject(projectId);
};

export const listUserProjects = async (
  userId: string,
  limit = 50,
  offset = 0
): Promise<Project[]> => {
  return await ProjectModel.listProjectsByUserId(userId, limit, offset);
};  