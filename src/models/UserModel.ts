// src/models/UserModel.ts
export interface User {
    id: string;
    email: string;
    full_name?: string | null;
    password_hash?: string; // optional since Supabase handles auth for some users
    created_at?: string;
    updated_at?: string;
}

// For user creation (manual, not Supabase-admin created)
export interface CreateUserDto {
    email: string;
    password: string;
    full_name?: string;
}
