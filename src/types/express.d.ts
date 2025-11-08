// src/types/express/index.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      full_name?: string;
      avatar_url?: string;
      created_at: string;
      updated_at: string;
    };
    userId?: string;
  }
}