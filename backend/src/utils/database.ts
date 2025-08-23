import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'vehicle_tracker',
  user: process.env.DB_USER || 'postgres',
};

// Only add password if it's provided and not empty
if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
  (poolConfig as any).password = process.env.DB_PASSWORD;
}

const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  ('✅ Connected to PostgreSQL database');
});

pool.on('error', (err: any) => {
  console.error('❌ Database connection error:', err);
});

export const connectDB = async (): Promise<void> => {
  try {
    await pool.connect();
    ('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default pool;