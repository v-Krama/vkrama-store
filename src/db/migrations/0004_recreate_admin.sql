-- Delete existing admin and re-create with correct password
DELETE FROM admins WHERE email = 'admin@vkrama.com.np';

INSERT INTO admins (id, email, name, password_hash, role, is_active, permissions)
VALUES (
  lower(hex(randomblob(16))),
  'admin@vkrama.com.np',
  'Super Admin',
  '$2b$12$HJwsqCkMdIrUrXZjoTbJyuM/AZ2cZNH0GN7whSsuxlgIAkHXxJt5C',
  'superadmin',
  1,
  '["products","orders","customers","settings","admins","marketing","content"]'
);
