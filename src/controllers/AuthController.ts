

// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import * as AuthService from '../services/AuthService';
import { ApiResponse, SignUpRequest, AuthRequest, ResetPasswordRequest, UpdatePasswordRequest } from '../types/auth';
import { AuthenticatedRequest } from '../middleware/auth';

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: SignUpRequest = req.body;

        if (!data.email || !data.password) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required',
            } as ApiResponse);
            return;
        }

        if (data.password.length < 6) {
            res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters',
            } as ApiResponse);
            return;
        }

        const result = await AuthService.signUp(data);

        res.status(201).json({
            success: true,
            data: result,
            message: 'User registered successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Sign up error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Registration failed',
        } as ApiResponse);
    }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: AuthRequest = req.body;

        if (!data.email || !data.password) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required',
            } as ApiResponse);
            return;
        }

        const result = await AuthService.signIn(data);

        res.json({
            success: true,
            data: result,
            message: 'Signed in successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Sign in error:', error);
        res.status(401).json({
            success: false,
            error: error.message || 'Invalid credentials',
        } as ApiResponse);
    }
};

export const signOut = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(400).json({
                success: false,
                error: 'No token provided',
            } as ApiResponse);
            return;
        }

        const token = authHeader.substring(7);
        await AuthService.signOut(token);

        res.json({
            success: true,
            message: 'Signed out successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Sign out error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Sign out failed',
        } as ApiResponse);
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            res.status(400).json({
                success: false,
                error: 'Refresh token is required',
            } as ApiResponse);
            return;
        }

        const result = await AuthService.refreshToken(refresh_token);

        res.json({
            success: true,
            data: result,
        } as ApiResponse);
    } catch (error: any) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            error: error.message || 'Token refresh failed',
        } as ApiResponse);
    }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: ResetPasswordRequest = req.body;

        if (!data.email) {
            res.status(400).json({
                success: false,
                error: 'Email is required',
            } as ApiResponse);
            return;
        }

        await AuthService.requestPasswordReset(data);

        res.json({
            success: true,
            message: 'Password reset email sent',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to send reset email',
        } as ApiResponse);
    }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: UpdatePasswordRequest = req.body;

        if (!data.password || !data.access_token) {
            res.status(400).json({
                success: false,
                error: 'Password and access token are required',
            } as ApiResponse);
            return;
        }

        if (data.password.length < 6) {
            res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters',
            } as ApiResponse);
            return;
        }

        await AuthService.updatePassword(data);

        res.json({
            success: true,
            message: 'Password updated successfully',
        } as ApiResponse);
    } catch (error: any) {
        console.error('Password update error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update password',
        } as ApiResponse);
    }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated',
            } as ApiResponse);
            return;
        }

        const user = await AuthService.getCurrentUser(req.userId);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            } as ApiResponse);
            return;
        }

        res.json({
            success: true,
            data: user,
        } as ApiResponse);
    } catch (error: any) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get user',
        } as ApiResponse);
    }
};