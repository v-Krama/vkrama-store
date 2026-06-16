-- Add prebooking support to products
ALTER TABLE products ADD COLUMN prebooking_status TEXT DEFAULT 'none';
ALTER TABLE products ADD COLUMN prebooking_release_date TEXT;
