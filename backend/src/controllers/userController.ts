import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../utils/database';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Validasi input
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Cek jika email sudah ada
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const result = await pool.query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, created_at`,
      [email, hashedPassword, name, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, name, role, password } = req.body;

    // Cek jika user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (email) {
      // Cek jika email sudah digunakan oleh user lain
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }
      updateFields.push(`email = $${valueIndex}`);
      values.push(email);
      valueIndex++;
    }

    if (name) {
      updateFields.push(`name = $${valueIndex}`);
      values.push(name);
      valueIndex++;
    }

    if (role) {
      updateFields.push(`role = $${valueIndex}`);
      values.push(role);
      valueIndex++;
    }

    if (password) {
      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push(`password = $${valueIndex}`);
      values.push(hashedPassword);
      valueIndex++;
    }

    if (updateFields.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING id, email, name, role, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Cek jika user exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (userCheck.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prevent deleting own account
    const currentUser = (req as any).user;
    if (parseInt(id) === currentUser.id) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};