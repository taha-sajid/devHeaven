
// src/models/ProjectModel.ts (Add user_id support)
import supabase from '../config/database';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types';
import { generateShareUrl } from '../utils/helpers';

interface CreateProjectWithUserDto extends CreateProjectDto {
  user_id: string;
}

export const createProject = async (data: CreateProjectWithUserDto): Promise<Project> => {
  const shareUrl = generateShareUrl();

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...data,
      share_url: shareUrl,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return project;
};

export const findProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return data;
};

export const findProjectByShareUrl = async (shareUrl: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('share_url', shareUrl)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return data;
};

export const updateProject = async (id: string, data: UpdateProjectDto): Promise<Project> => {
  const { data: project, error } = await supabase
    .from('projects')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  return project;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
};

export const listProjects = async (limit = 50, offset = 0): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to list projects: ${error.message}`);
  }

  return data || [];
};

export const listProjectsByUserId = async (
  userId: string,
  limit = 50,
  offset = 0
): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to list user projects: ${error.message}`);
  }

  return data || [];
};