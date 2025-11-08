// src/types/index.ts

// Database Entity Interfaces
export interface Project {
    id: string;
    title: string;
    description?: string;
    prompt: string;
    share_url: string;
    user_id?: string; // Add this field
    created_at: string;
    updated_at: string;
}
export interface File {
    id: string;
    project_id: string;
    filename: string;
    content: string;
    language: string;
    created_at: string;
    updated_at: string;
}

export interface Generation {
    id: string;
    project_id?: string;
    prompt: string;
    model: string;
    tokens_used?: number;
    generation_time_ms?: number;
    created_at: string;
}

// DTOs (Data Transfer Objects) for Creating/Updating Entities
export interface CreateProjectDto {
    title: string;
    description?: string;
    prompt: string;
}

export interface UpdateProjectDto {
    title?: string;
    description?: string;
    prompt?: string;
}

export interface CreateFileDto {
    project_id: string;
    filename: string;
    content: string;
    language: string;
}

export interface UpdateFileDto {
    filename?: string;
    content?: string;
    language?: string;
}

export interface CreateGenerationDto {
    project_id?: string;
    prompt: string;
    model: string;
    tokens_used?: number;
    generation_time_ms?: number;
}

// API Request/Response Types
export interface CreateProjectRequest {
    prompt: string;
    title?: string;
    description?: string;
}

export interface GenerateCodeRequest {
    prompt: string;
    context?: string;
    model?: string;
    provider?: string; // New field
}

export interface GenerateCodeResponse {
    code: string;
    files: Array<{
        name: string;
        content: string;
        language: string;
    }>;
    explanation?: string;
    metadata?: {
        model: string;
        provider?: string;
        usage?: {
            inputTokens: number;
            outputTokens: number;
        };
        generationTime: number;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}