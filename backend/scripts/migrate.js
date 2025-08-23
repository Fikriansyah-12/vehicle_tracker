const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
  };

  if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
    poolConfig.password = process.env.DB_PASSWORD;
    ('Using password: YES');
  } else {
    ('Using password: NO (empty)');
  }

  const pool = new Pool(poolConfig);

  const client = await pool.connect();
  
  try {
    const targetDb = process.env.DB_NAME || 'vehicle_tracker';
    const dbCheck = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
      [targetDb]
    );

    if (dbCheck.rows.length === 0) {
      await client.query(`CREATE DATABASE ${targetDb}`);
    }

    await client.release();
    await pool.end();

    const targetPoolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: targetDb,
      user: process.env.DB_USER || 'postgres',
    };

    if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') {
      targetPoolConfig.password = process.env.DB_PASSWORD;
    }

    const targetPool = new Pool(targetPoolConfig);
    const targetClient = await targetPool.connect();

    try {
      const { rows } = await targetClient.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'migrations'
        );
      `);

      if (!rows[0].exists) {
        await targetClient.query(`
          CREATE TABLE migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
      }

      // Get all migration files
      const migrationDir = path.join(__dirname, '../database/migrations');
      if (!fs.existsSync(migrationDir)) {
        fs.mkdirSync(migrationDir, { recursive: true });
      }

      const files = fs.readdirSync(migrationDir)
        .filter(file => file.endsWith('.sql'))
        .sort();


      if (files.length === 0) {
        return;
      }

      let executedMigrations = 0;

      for (const file of files) {
        const result = await targetClient.query(
          'SELECT id FROM migrations WHERE name = $1',
          [file]
        );

        if (result.rows.length === 0) {
          
          const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
          
          const statements = sql.split(';').filter(statement => statement.trim().length > 0);
          
          for (const statement of statements) {
            if (statement.trim()) {
              await targetClient.query(statement);
            }
          }
          
          await targetClient.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          
          executedMigrations++;
        } else {
        }
      }


    } catch (error) {
      throw error;
    } finally {
      await targetClient.release();
      await targetPool.end();
    }

  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations().catch(error => {
    process.exit(1);
  });
}

module.exports = { runMigrations };