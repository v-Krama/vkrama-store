-- Seed data for Vkrama ecommerce platform

-- Admin user (password: Admin@123)
-- PBKDF2 hash: generate with node using the hashPassword function in src/lib/auth.ts
INSERT INTO admins (id, email, name, password_hash, role, permissions)
VALUES (
  lower(hex(randomblob(16))),
  'admin@vkrama.com.np',
  'Super Admin',
  'pbkdf2:100000:pOOYUuME44Ed0YRAcjHHnKdYnjf7zgKo26e9knAPeSQ=:ANY4ejV4z8Z002yzm/LyIfnFzzg3qSkWh3sMiw7QbrVuyr/pelbgxnY926nKsjrIRCVb+W3KPwd5Xo48y7Uhbw==',
  'superadmin',
  '["products", "orders", "customers", "settings", "admins", "marketing", "content"]'
);

-- Settings
INSERT OR IGNORE INTO settings (key, value, type, description) VALUES
  ('store_name', 'Vkrama', 'string', 'Store display name'),
  ('store_tagline', 'Discover Excellence', 'string', 'Store tagline'),
  ('store_email', 'hello@vkrama.com.np', 'string', 'Store contact email'),
  ('store_phone', '+977-1-4XXXXXX', 'string', 'Store contact phone'),
  ('store_address', 'Kathmandu, Nepal', 'string', 'Store physical address'),
  ('currency', 'NPR', 'string', 'Default currency'),
  ('currency_symbol', 'Rs.', 'string', 'Currency symbol'),
  ('tax_rate', '13', 'number', 'Default tax rate percentage'),
  ('shipping_cost_cents', '0', 'number', 'Default shipping cost in cents'),
  ('free_shipping_minimum_cents', '500000', 'number', 'Free shipping threshold in cents'),
  ('order_auto_confirm', 'true', 'boolean', 'Auto-confirm orders'),
  ('order_auto_fulfill_days', '1', 'number', 'Days after which confirmed orders auto-fulfill'),
  ('low_stock_threshold', '10', 'number', 'Low stock alert threshold'),
  ('enable_reviews', 'true', 'boolean', 'Enable product reviews'),
  ('enable_wishlist', 'true', 'boolean', 'Enable wishlist feature'),
  ('meta_title', 'Vkrama - Premium Shopping in Nepal', 'string', 'Default SEO meta title'),
  ('meta_description', 'Discover premium products at Vkrama. Shop electronics, fashion, home & living, and more with fast delivery across Nepal.', 'string', 'Default SEO meta description');

-- Inventory locations
INSERT INTO inventory_locations (id, name, code, address) VALUES
  (lower(hex(randomblob(16))), 'Main Warehouse', 'WH-MAIN', 'Kathmandu, Nepal'),
  (lower(hex(randomblob(16))), 'Store Front', 'STORE-01', 'Lalitpur, Nepal');

-- Categories
INSERT INTO categories (id, name, slug, description, seo_title, sort_order) VALUES
  (lower(hex(randomblob(16))), 'Electronics', 'electronics', 'Latest gadgets, phones, laptops, and accessories', 'Shop Electronics Online in Nepal - Vkrama', 1),
  (lower(hex(randomblob(16))), 'Clothing', 'clothing', 'Trendy fashion for men, women, and kids', 'Shop Clothing & Fashion - Vkrama', 2),
  (lower(hex(randomblob(16))), 'Home & Living', 'home-living', 'Everything for your home, from decor to kitchenware', 'Shop Home & Living Products - Vkrama', 3);

-- Subcategories
INSERT INTO categories (id, name, slug, description, parent_id, sort_order)
SELECT lower(hex(randomblob(16))), 'Smartphones', 'smartphones', 'Latest smartphones and accessories', id, 1
FROM categories WHERE slug = 'electronics';

INSERT INTO categories (id, name, slug, description, parent_id, sort_order)
SELECT lower(hex(randomblob(16))), 'Laptops', 'laptops', 'Laptops for work, study, and gaming', id, 2
FROM categories WHERE slug = 'electronics';

INSERT INTO categories (id, name, slug, description, parent_id, sort_order)
SELECT lower(hex(randomblob(16))), 'Men', 'men', 'Mens clothing and accessories', id, 1
FROM categories WHERE slug = 'clothing';

INSERT INTO categories (id, name, slug, description, parent_id, sort_order)
SELECT lower(hex(randomblob(16))), 'Women', 'women', 'Womens clothing and accessories', id, 2
FROM categories WHERE slug = 'clothing';

-- Custom collections
INSERT INTO collections (id, name, slug, description, sort_order) VALUES
  (lower(hex(randomblob(16))), 'New Arrivals', 'new-arrivals', 'Check out our latest products', 1),
  (lower(hex(randomblob(16))), 'Best Sellers', 'best-sellers', 'Our most popular products', 2),
  (lower(hex(randomblob(16))), 'Trending Now', 'trending-now', 'What everyone is talking about', 3),
  (lower(hex(randomblob(16))), 'Special Offers', 'special-offers', 'Products with special discounts', 4);

-- Sample Product: Wireless Headphones
INSERT INTO products (id, name, slug, description, brand, tags, is_featured, is_physical, status, sort_order)
VALUES (lower(hex(randomblob(16))), 'Premium Wireless Headphones', 'premium-wireless-headphones', 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.', 'Vkrama Audio', '["audio","wireless","headphones","premium","noise-cancelling"]', 1, 1, 'active', 1);

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Black', 'VK-AUDIO-BLK-001', 899900, 1299900, 450000, 50, 0.25, '/api/image/headphones-black.jpg', 1, 1 FROM products WHERE slug = 'premium-wireless-headphones';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'White', 'VK-AUDIO-WHT-001', 899900, 1299900, 450000, 35, 0.25, '/api/image/headphones-white.jpg', 1, 2 FROM products WHERE slug = 'premium-wireless-headphones';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Midnight Blue', 'VK-AUDIO-BLU-001', 949900, 1299900, 480000, 20, 0.25, '/api/image/headphones-blue.jpg', 1, 3 FROM products WHERE slug = 'premium-wireless-headphones';

-- Link headphones to categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'premium-wireless-headphones' AND c.slug = 'electronics';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'premium-wireless-headphones' AND c.slug = 'smartphones';

-- Variant options for headphones
INSERT INTO variant_options (product_id, group_name, value, sort_order)
SELECT id, 'Color', 'Black', 1 FROM products WHERE slug = 'premium-wireless-headphones';

INSERT INTO variant_options (product_id, group_name, value, sort_order)
SELECT id, 'Color', 'White', 2 FROM products WHERE slug = 'premium-wireless-headphones';

INSERT INTO variant_options (product_id, group_name, value, sort_order)
SELECT id, 'Color', 'Midnight Blue', 3 FROM products WHERE slug = 'premium-wireless-headphones';

-- Sample Product: Cotton T-Shirt
INSERT INTO products (id, name, slug, description, brand, tags, is_featured, is_physical, status, sort_order)
VALUES (lower(hex(randomblob(16))), 'Classic Fit Cotton T-Shirt', 'classic-fit-cotton-tshirt', 'Made from 100% organic cotton, this classic fit t-shirt offers unmatched comfort and breathability.', 'Vkrama Basics', '["clothing","t-shirt","cotton","casual","organic"]', 1, 1, 'active', 2);

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'S / White', 'VK-TEE-S-WHT-001', 149900, 199900, 75000, 100, 0.2, '/api/image/tshirt-white.jpg', 1, 1 FROM products WHERE slug = 'classic-fit-cotton-tshirt';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'M / White', 'VK-TEE-M-WHT-001', 149900, 199900, 75000, 150, 0.22, '/api/image/tshirt-white.jpg', 1, 2 FROM products WHERE slug = 'classic-fit-cotton-tshirt';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'L / White', 'VK-TEE-L-WHT-001', 149900, 199900, 75000, 120, 0.24, '/api/image/tshirt-white.jpg', 1, 3 FROM products WHERE slug = 'classic-fit-cotton-tshirt';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'S / Black', 'VK-TEE-S-BLK-001', 149900, 199900, 75000, 80, 0.2, '/api/image/tshirt-black.jpg', 1, 4 FROM products WHERE slug = 'classic-fit-cotton-tshirt';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'M / Black', 'VK-TEE-M-BLK-001', 149900, 199900, 75000, 130, 0.22, '/api/image/tshirt-black.jpg', 1, 5 FROM products WHERE slug = 'classic-fit-cotton-tshirt';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'L / Black', 'VK-TEE-L-BLK-001', 149900, 199900, 75000, 110, 0.24, '/api/image/tshirt-black.jpg', 1, 6 FROM products WHERE slug = 'classic-fit-cotton-tshirt';

-- Link t-shirt to categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'classic-fit-cotton-tshirt' AND c.slug = 'clothing';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'classic-fit-cotton-tshirt' AND c.slug = 'men';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'classic-fit-cotton-tshirt' AND c.slug = 'women';

-- Sample Product: Ceramic Mug Set
INSERT INTO products (id, name, slug, description, brand, tags, is_featured, is_physical, status, sort_order)
VALUES (lower(hex(randomblob(16))), 'Artisan Ceramic Mug Set', 'artisan-ceramic-mug-set', 'Set of 4 handcrafted ceramic mugs, each uniquely designed by local Nepali artisans. Microwave and dishwasher safe.', 'Vkrama Home', '["home","kitchen","ceramic","mug","artisan","nepal"]', 1, 1, 'active', 3);

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Set of 4 - Earth Tones', 'VK-HOME-MUG-ET-001', 249900, 299900, 125000, 40, 0.8, '/api/image/mugs-earth.jpg', 1, 1 FROM products WHERE slug = 'artisan-ceramic-mug-set';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Set of 4 - Pastel', 'VK-HOME-MUG-PS-001', 269900, 299900, 135000, 30, 0.8, '/api/image/mugs-pastel.jpg', 1, 2 FROM products WHERE slug = 'artisan-ceramic-mug-set';

INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Set of 6 - Mixed', 'VK-HOME-MUG-MX-001', 399900, 499900, 200000, 25, 1.2, '/api/image/mugs-mixed.jpg', 1, 3 FROM products WHERE slug = 'artisan-ceramic-mug-set';

-- Link to categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'artisan-ceramic-mug-set' AND c.slug = 'home-living';

-- Add to collections
INSERT INTO collection_products (collection_id, product_id)
SELECT cl.id, p.id FROM collections cl, products p WHERE cl.slug = 'new-arrivals' AND p.slug = 'premium-wireless-headphones';

INSERT INTO collection_products (collection_id, product_id)
SELECT cl.id, p.id FROM collections cl, products p WHERE cl.slug = 'best-sellers' AND p.slug = 'classic-fit-cotton-tshirt';

INSERT INTO collection_products (collection_id, product_id)
SELECT cl.id, p.id FROM collections cl, products p WHERE cl.slug = 'trending-now' AND p.slug = 'artisan-ceramic-mug-set';

INSERT INTO collection_products (collection_id, product_id)
SELECT cl.id, p.id FROM collections cl, products p WHERE cl.slug = 'special-offers' AND p.slug = 'premium-wireless-headphones';

-- Customer (password: Customer@123)
INSERT INTO customers (id, email, name, phone, password_hash, is_verified, accepts_marketing)
VALUES (lower(hex(randomblob(16))), 'customer@vkrama.com.np', 'Test Customer', '+977-98XXXXXXXX', 'pbkdf2:100000:9eOa/EcsBzFFb0pZWiFO0FUOx9YziSehGfdkuZKJ2R0=:1m/7OFYT4MX1fT8FuJUk4Bpu8GFA5f9CY+xm8RwDLu3FAhGOic9JccnLvgFYD7PIHUZuXbSv6IzqQBh39B5ehw==', 1, 1);

-- Navigation menus
INSERT INTO menus (id, name, location, is_active) VALUES
  (lower(hex(randomblob(16))), 'Main Navigation', 'header', 1),
  (lower(hex(randomblob(16))), 'Footer Links', 'footer', 1);

-- Header menu items
INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Home', '/', 'custom', 1 FROM menus WHERE location = 'header';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Shop', '/products', 'custom', 2 FROM menus WHERE location = 'header';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Electronics', '/products?category=electronics', 'category', 3 FROM menus WHERE location = 'header';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Clothing', '/products?category=clothing', 'category', 4 FROM menus WHERE location = 'header';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Home & Living', '/products?category=home-living', 'category', 5 FROM menus WHERE location = 'header';

-- Footer menu items
INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'About Us', '/about', 'page', 1 FROM menus WHERE location = 'footer';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Contact', '/contact', 'page', 2 FROM menus WHERE location = 'footer';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Privacy Policy', '/privacy', 'page', 3 FROM menus WHERE location = 'footer';

INSERT INTO menu_items (id, menu_id, title, url, type, sort_order)
SELECT lower(hex(randomblob(16))), id, 'Terms of Service', '/terms', 'page', 4 FROM menus WHERE location = 'footer';

-- CMS Pages
INSERT INTO pages (id, title, slug, content, is_published, published_at)
VALUES (lower(hex(randomblob(16))), 'About Us', 'about', '<h2>Welcome to Vkrama</h2><p>Vkrama Group Private Limited is a Nepali company dedicated to bringing you the finest products from Nepal and around the world.</p>', 1, datetime('now'));

INSERT INTO pages (id, title, slug, content, is_published, published_at)
VALUES (lower(hex(randomblob(16))), 'Contact Us', 'contact', '<h2>Get in Touch</h2><p>Email: hello@vkrama.com.np</p><p>Phone: +977-1-4XXXXXX</p><p>Kathmandu, Nepal</p>', 1, datetime('now'));

INSERT INTO pages (id, title, slug, content, is_published, published_at)
VALUES (lower(hex(randomblob(16))), 'Privacy Policy', 'privacy', '<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>', 1, datetime('now'));
