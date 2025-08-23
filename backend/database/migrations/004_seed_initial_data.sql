-- Migration: seed_initial_data
-- Created at: 2023-10-01

-- UP Migration
BEGIN;

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES
('admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('user@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Regular User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (name, license_plate, model, year) VALUES
('Delivery Van 1', 'B 1234 ABC', 'Ford Transit', 2020),
('Delivery Van 2', 'B 5678 DEF', 'Mercedes Sprinter', 2021),
('Service Car 1', 'B 9012 GHI', 'Toyota Corolla', 2019),
('Service Car 2', 'B 3456 JKL', 'Honda Civic', 2022),
('Truck 1', 'B 7890 MNO', 'Isuzu Elf', 2018)
ON CONFLICT (license_plate) DO NOTHING;

-- Insert sample vehicle status data
INSERT INTO vehicle_status (vehicle_id, status, location, date, timestamp) VALUES
(1, 'trip', 'Jakarta', '2023-10-01', '2023-10-01 08:30:00'),
(1, 'idle', 'Jakarta', '2023-10-01', '2023-10-01 09:45:00'),
(1, 'stopped', 'Office', '2023-10-01', '2023-10-01 12:00:00'),
(2, 'idle', 'Bandung', '2023-10-01', '2023-10-01 08:15:00'),
(2, 'trip', 'Bandung', '2023-10-01', '2023-10-01 10:30:00'),
(2, 'stopped', 'Warehouse', '2023-10-01', '2023-10-01 13:45:00'),
(3, 'trip', 'Surabaya', '2023-10-01', '2023-10-01 09:00:00'),
(3, 'idle', 'Surabaya', '2023-10-01', '2023-10-01 11:30:00');

COMMIT;

-- DOWN Migration
-- BEGIN;
-- DELETE FROM vehicle_status;
-- DELETE FROM vehicles;
-- DELETE FROM users;
-- COMMIT;