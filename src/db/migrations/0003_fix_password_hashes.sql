-- Fix admin password hash (password: Admin@123)
UPDATE admins SET password_hash = '$2b$12$KRD/vi91TRFs8aM/niDqyOLY.WNF4IXMm7q3KtGkkDV6GZCDLWm7i' WHERE email = 'admin@vkrama.com.np';

-- Fix customer password hash (password: Customer@123)
UPDATE customers SET password_hash = '$2b$12$KRD/vi91TRFs8aM/niDqyOLY.WNF4IXMm7q3KtGkkDV6GZCDLWm7i' WHERE email = 'customer@vkrama.com.np';
