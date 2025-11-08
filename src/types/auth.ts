export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthRequest {
    email: string;
    password: string;
}

export interface SignUpRequest extends AuthRequest {
    full_name?: string;
}

export interface AuthResponse {
    user: User;
    session: {
        access_token: string;
        refresh_token: string;
        expires_at: number;
    };
}

export interface ResetPasswordRequest {
    email: string;
}

export interface UpdatePasswordRequest {
    password: string;
    access_token: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
