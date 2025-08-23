import bcrypt from 'bcryptjs';
import pool from '../src/utils/database';

async function fixPasswords() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      `UPDATE users SET password = $1 WHERE email IN ('admin@example.com', 'user@example.com')`,
      [hashedPassword]
    );
    
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    process.exit();
  }
}

fixPasswords();