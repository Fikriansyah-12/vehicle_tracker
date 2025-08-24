import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/database';
import { asyncHandler, AuthenticationError, ValidationError } from '../middleware/errorHandler';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new AuthenticationError('Invalid credentials');
  }

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AuthenticationError('Invalid credentials');
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '1h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
});