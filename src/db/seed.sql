-- Admin user
INSERT OR IGNORE INTO admins (id, email, name, password_hash, role) VALUES
  ('admin_01', 'admin@vkrama.com', 'VKrama Admin', '$2b$10$djYbs.Xj9nxI/e8udozD7OFyhehR7nMD97Pde9gujsCsASl.kuE5S', 'superadmin');

-- Categories
INSERT OR IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
  ('cat_01', 'Electronics', 'electronics', 'Gadgets, devices, and tech accessories', 1),
  ('cat_02', 'Clothing', 'clothing', 'Apparel and fashion accessories', 2),
  ('cat_03', 'Home & Living', 'home-living', 'Furniture, decor, and household items', 3);

-- Products
INSERT OR IGNORE INTO products (id, name, slug, description, price_cents, compare_at_price_cents, stock, status, image_url, seo_title, seo_description) VALUES
  ('prod_01', 'Premium Wireless Headphones', 'premium-wireless-headphones', 'Experience crystal-clear audio with our premium noise-canceling wireless headphones. Features 30-hour battery life, comfortable over-ear design, and advanced ANC technology.', 12999, 15999, 50, 'active', '/images/headphones.jpg', 'Premium Wireless Headphones | vkrama', 'Premium noise-canceling wireless headphones with 30-hour battery life. Shop at vkrama.'),
  ('prod_02', 'Organic Cotton T-Shirt', 'organic-cotton-tshirt', 'Comfortable 100% organic cotton t-shirt. Pre-shrunk, breathable fabric available in multiple colors. Perfect for everyday wear.', 2999, 3999, 200, 'active', '/images/tshirt.jpg', 'Organic Cotton T-Shirt | vkrama', 'Comfortable 100% organic cotton t-shirt available in multiple colors. Shop at vkrama.'),
  ('prod_03', 'Minimalist Ceramic Mug', 'minimalist-ceramic-mug', 'Handcrafted ceramic mug with minimalist design. Holds 12oz. Microwave and dishwasher safe. Each piece is unique.', 1499, NULL, 100, 'active', '/images/mug.jpg', 'Minimalist Ceramic Mug | vkrama', 'Handcrafted ceramic mug with minimalist design. Shop at vkrama.');

-- Product categories
INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES
  ('prod_01', 'cat_01'),
  ('prod_02', 'cat_02'),
  ('prod_03', 'cat_03');

-- Product variants
INSERT OR IGNORE INTO product_variants (id, product_id, name, stock, price_cents, sort_order) VALUES
  ('var_01', 'prod_02', 'Small / Black', 30, NULL, 1),
  ('var_02', 'prod_02', 'Medium / Black', 50, NULL, 2),
  ('var_03', 'prod_02', 'Large / Black', 40, NULL, 3),
  ('var_04', 'prod_02', 'Medium / White', 45, NULL, 4),
  ('var_05', 'prod_02', 'Large / White', 35, 3499, 5);

-- Variant options
INSERT OR IGNORE INTO variant_options (product_id, group_name, value, sort_order) VALUES
  ('prod_02', 'Size', 'Small', 1),
  ('prod_02', 'Size', 'Medium', 2),
  ('prod_02', 'Size', 'Large', 3),
  ('prod_02', 'Color', 'Black', 1),
  ('prod_02', 'Color', 'White', 2);
