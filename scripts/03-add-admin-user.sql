-- Create a default admin user for testing
-- Password: Admin@123

INSERT INTO users (name, email, password_hash, role) 
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$YourHashedPasswordHere',
  'admin'
) ON DUPLICATE KEY UPDATE role = 'admin';

-- Note: You should generate the password hash using bcrypt
-- In Node.js: await bcrypt.hash('Admin@123', 10)
-- Replace $2a$10$YourHashedPasswordHere with the actual hash
