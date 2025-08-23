const fs = require('fs');
const path = require('path');

function createMigration() {
  const migrationName = process.argv[2];
  if (!migrationName) {
    ('Usage: npm run migrate:create -- <migration-name>');
    process.exit(1);
  }

  const cleanName = migrationName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');

  const timestamp = Date.now();
  const fileName = `${timestamp}_${cleanName}.sql`;
  const migrationsDir = path.join(__dirname, '../database/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  const filePath = path.join(migrationsDir, fileName);

  const template = `-- Migration: ${cleanName}
-- Created at: ${new Date().toISOString()}

-- UP Migration
BEGIN;

-- Add your SQL commands here
-- Example: CREATE TABLE example (id SERIAL PRIMARY KEY, name VARCHAR(255));

COMMIT;

-- DOWN Migration (optional)
-- BEGIN;
-- DROP TABLE IF EXISTS example;
-- COMMIT;
`;

  fs.writeFileSync(filePath, template);
}

createMigration();