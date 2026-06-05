INSERT INTO admins (id, email, name, password_hash, role) VALUES
  ('admin_01', 'admin@vkrama.com', 'VKrama Admin', '$2a$10$PLACEHOLDER', 'superadmin');

INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('cat_01', 'Electronics', 'electronics', 'Gadgets, devices, and tech accessories', 1),
  ('cat_02', 'Clothing', 'clothing', 'Apparel and fashion accessories', 2),
  ('cat_03', 'Home & Living', 'home-living', 'Furniture, decor, and household items', 3);

INSERT INTO products (id, name, slug, description, price_cents, stock, status, image_url) VALUES
  ('prod_01', 'Wireless Headphones', 'wireless-headphones', 'Premium noise-canceling wireless headphones with 30-hour battery life.', 12999, 50, 'active', '/images/headphones.jpg'),
  ('prod_02', 'Cotton T-Shirt', 'cotton-tshirt', 'Comfortable 100% organic cotton t-shirt available in multiple colors.', 2999, 200, 'active', '/images/tshirt.jpg'),
  ('prod_03', 'Ceramic Mug', 'ceramic-mug', 'Handcrafted ceramic mug with minimalist design.', 1499, 100, 'active', '/images/mug.jpg');

INSERT INTO product_categories (product_id, category_id) VALUES
  ('prod_01', 'cat_01'),
  ('prod_02', 'cat_02'),
  ('prod_03', 'cat_03');

INSERT INTO product_variants (id, product_id, name, stock, price_cents, sort_order) VALUES
  ('var_01', 'prod_02', 'Small / Black', 30, NULL, 1),
  ('var_02', 'prod_02', 'Medium / Black', 50, NULL, 2),
  ('var_03', 'prod_02', 'Large / Black', 40, NULL, 3),
  ('var_04', 'prod_02', 'Medium / White', 45, NULL, 4),
  ('var_05', 'prod_02', 'Large / White', 35, 3499, 5);

INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES
  ('prod_02', 'Size', 'Small', 1),
  ('prod_02', 'Size', 'Medium', 2),
  ('prod_02', 'Size', 'Large', 3),
  ('prod_02', 'Color', 'Black', 1),
  ('prod_02', 'Color', 'White', 2);
