
// src/models/GenerationModel.ts
import supabase from '../config/database';
import { Generation, CreateGenerationDto } from '../types';

export const createGeneration = async (data: CreateGenerationDto): Promise<Generation> => {
  const { data: generation, error } = await supabase
    .from('generations')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create generation: ${error.message}`);
  }

  return generation;
};

export const findGenerationsByProjectId = async (projectId: string): Promise<Generation[]> => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch generations: ${error.message}`);
  }

  return data || [];
};

export const getGenerationStats = async (): Promise<{
  total_generations: number;
  total_tokens: number;
  avg_generation_time: number;
}> => {
  const { data, error } = await supabase
    .from('generations')
    .select('tokens_used, generation_time_ms');

  if (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }

  const stats = {
    total_generations: data?.length || 0,
    total_tokens: data?.reduce((sum, g) => sum + (g.tokens_used || 0), 0) || 0,
    avg_generation_time: data?.length
      ? data.reduce((sum, g) => sum + (g.generation_time_ms || 0), 0) / data.length
      : 0,
  };

  return stats;
};