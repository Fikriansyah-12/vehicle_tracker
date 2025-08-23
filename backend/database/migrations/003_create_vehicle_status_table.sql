-- Migration: create_vehicle_status_table
-- Created at: 2023-10-01

-- UP Migration
BEGIN;

CREATE TABLE vehicle_status (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('trip', 'idle', 'stopped')),
  location VARCHAR(255),
  date DATE NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_status_vehicle_date ON vehicle_status(vehicle_id, date);
CREATE INDEX idx_vehicle_status_timestamp ON vehicle_status(timestamp);

COMMIT;

-- DOWN Migration
-- BEGIN;
-- DROP TABLE IF EXISTS vehicle_status;
-- COMMIT;