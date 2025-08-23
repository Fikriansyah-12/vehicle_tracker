import { Request, Response } from 'express';
import pool from '../utils/database';

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM vehicles ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM vehicles');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      vehicles: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getVehicleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date parameter is required' });
      return;
    }

    const result = await pool.query(
      `SELECT * FROM vehicle_status 
       WHERE vehicle_id = $1 AND date = $2 
       ORDER BY timestamp`,
      [id, date]
    );

    res.json({ status: result.rows });
  } catch (error) {
    console.error('Get vehicle status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};