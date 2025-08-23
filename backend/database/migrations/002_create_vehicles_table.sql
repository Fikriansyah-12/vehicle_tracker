-- Up migration
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  model VARCHAR(255),
  year INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);