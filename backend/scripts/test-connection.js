const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  ('🔍 Testing database connection...');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
  };

  // Only add password if provided
  if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
    config.password = process.env.DB_PASSWORD;
    ('Using password: YES');
  } else {
    ('Using password: NO');
  }

  ('Connection config:', config);

  try {
    const pool = new Pool(config);
    const client = await pool.connect();
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    ('Current database time:', result.rows[0].current_time);
    
    await client.release();
    await pool.end();
    return true;
  } catch (error) {    
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});