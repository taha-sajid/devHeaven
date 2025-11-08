
// src/services/AuthService.ts
import { supabaseAdmin } from '../config/database';
import { SignUpRequest, AuthRequest, ResetPasswordRequest, UpdatePasswordRequest, AuthResponse } from '../types/auth';
import { User } from '@supabase/supabase-js';


export const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
    try {
        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true, // Auto-confirm for MVP
            user_metadata: {
                full_name: data.full_name || '',
            },
        });

        if (authError) {
            throw new Error(`Failed to create user: ${authError.message}`);
        }

        if (!authData.user) {
            throw new Error('User creation failed');
        }

        // Create user profile in database
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authData.user.id,
                email: authData.user.email,
                full_name: data.full_name,
            });

        if (profileError) {
            // Rollback auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            throw new Error(`Failed to create user profile: ${profileError.message}`);
        }

        // Generate session
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (sessionError || !sessionData.session) {
            throw new Error('Failed to create session');
        }

        return {
            user: {
                id: authData.user.id,
                email: authData.user.email!,
                full_name: data.full_name,
                created_at: authData.user.created_at,
                updated_at: authData.user.updated_at || authData.user.created_at,
            },
            session: {
                access_token: sessionData.session.access_token,
                refresh_token: sessionData.session.refresh_token,
                expires_at: sessionData.session.expires_at || 0,
            },
        };
    } catch (error: any) {
        throw new Error(`Sign up failed: ${error.message}`);
    }
};

export const signIn = async (data: AuthRequest): Promise<AuthResponse> => {
    try {
        const { data: authData, error } = await supabaseAdmin.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error || !authData.user || !authData.session) {
            throw new Error('Invalid credentials');
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            throw new Error('Failed to fetch user profile');
        }

        return {
            user: profile,
            session: {
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                expires_at: authData.session.expires_at || 0,
            },
        };
    } catch (error: any) {
        throw new Error(`Sign in failed: ${error.message}`);
    }
};

export const signOut = async (accessToken: string): Promise<void> => {
    try {
        const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);
        if (error) {
            throw new Error(`Sign out failed: ${error.message}`);
        }
    } catch (error: any) {
        throw new Error(`Sign out failed: ${error.message}`);
    }
};

export const verifyToken = async (accessToken: string): Promise<User | null> => {
    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

        if (error || !user) {
            return null;
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return null;
        }

        return profile;
    } catch (error) {
        return null;
    }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabaseAdmin.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error || !data.session || !data.user) {
            throw new Error('Failed to refresh token');
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            throw new Error('Failed to fetch user profile');
        }

        return {
            user: profile,
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at || 0,
            },
        };
    } catch (error: any) {
        throw new Error(`Token refresh failed: ${error.message}`);
    }
};

export const requestPasswordReset = async (data: ResetPasswordRequest): Promise<void> => {
    try {
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        });

        if (error) {
            throw new Error(`Failed to send reset email: ${error.message}`);
        }
    } catch (error: any) {
        throw new Error(`Password reset request failed: ${error.message}`);
    }
};

export const updatePassword = async (data: UpdatePasswordRequest): Promise<void> => {
    try {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            data.access_token,
            { password: data.password }
        );

        if (error) {
            throw new Error(`Failed to update password: ${error.message}`);
        }
    } catch (error: any) {
        throw new Error(`Password update failed: ${error.message}`);
    }
};

export const getCurrentUser = async (userId: string): Promise<User | null> => {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
};