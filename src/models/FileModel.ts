
// src/models/FileModel.ts
import supabase from '../config/database';
import { File, CreateFileDto, UpdateFileDto } from '../types';

export const createFile = async (data: CreateFileDto): Promise<File> => {
  const { data: file, error } = await supabase
    .from('files')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create file: ${error.message}`);
  }

  return file;
};

export const createManyFiles = async (files: CreateFileDto[]): Promise<File[]> => {
  const { data, error } = await supabase
    .from('files')
    .insert(files)
    .select();

  if (error) {
    throw new Error(`Failed to create files: ${error.message}`);
  }

  return data || [];
};

export const findFilesByProjectId = async (projectId: string): Promise<File[]> => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('project_id', projectId)
    .order('filename', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch files: ${error.message}`);
  }

  return data || [];
};

export const findFileById = async (id: string): Promise<File | null> => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch file: ${error.message}`);
  }

  return data;
};

export const updateFile = async (id: string, data: UpdateFileDto): Promise<File> => {
  const { data: file, error } = await supabase
    .from('files')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update file: ${error.message}`);
  }

  return file;
};

export const deleteFile = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

export const deleteFilesByProjectId = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Failed to delete files: ${error.message}`);
  }
};
