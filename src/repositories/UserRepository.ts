// src/repositories/userRepository.ts
import { pool } from '../database/connection';
import { User, CreateUserDto } from '../models/UserModel';
import bcrypt from 'bcrypt';

export const create = async (data: CreateUserDto): Promise<User> => {
  const password_hash = await bcrypt.hash(data.password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
    [data.email, password_hash]
  );
  return result.rows[0];
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

export const findById = async (id: string): Promise<User | null> => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const verifyPassword = async (email: string, password: string): Promise<User | null> => {
  const user = await findByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash!);
  return isValid ? user : null;
};