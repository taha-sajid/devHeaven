import { supabaseAdmin } from '../config/database';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types';

export const create = async (data: CreateProjectDto & { share_url: string }): Promise<Project> => {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  return project;
};

export const findById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabaseAdmin
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

export const findByShareUrl = async (shareUrl: string): Promise<Project | null> => {
  const { data, error } = await supabaseAdmin
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

export const update = async (id: string, data: UpdateProjectDto): Promise<Project> => {
  const { data: project, error } = await supabaseAdmin
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

export const deleteById = async (id: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
};

export const list = async (limit = 50, offset = 0): Promise<Project[]> => {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to list projects: ${error.message}`);
  }

  return data || [];
};