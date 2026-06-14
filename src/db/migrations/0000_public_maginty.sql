CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`actor_type` text NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`customer_id` text NOT NULL,
	`label` text DEFAULT 'Home',
	`name` text NOT NULL,
	`phone` text,
	`line1` text NOT NULL,
	`line2` text,
	`city` text NOT NULL,
	`state` text,
	`postal_code` text,
	`country` text DEFAULT 'NP' NOT NULL,
	`is_shipping_default` integer DEFAULT false NOT NULL,
	`is_billing_default` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`permissions` text DEFAULT '[]',
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image_url` text,
	`parent_id` text,
	`seo_title` text,
	`seo_description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `collection_products` (
	`collection_id` text NOT NULL,
	`product_id` text NOT NULL,
	`sort_order` integer DEFAULT 0,
	PRIMARY KEY(`collection_id`, `product_id`),
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_slug_unique` ON `collections` (`slug`);--> statement-breakpoint
CREATE TABLE `coupon_usages` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`coupon_id` text NOT NULL,
	`order_id` text NOT NULL,
	`customer_id` text,
	`discount_cents` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`value_cents` integer,
	`value_percent` real,
	`min_order_cents` integer,
	`max_discount_cents` integer,
	`usage_limit` integer,
	`used_count` integer DEFAULT 0,
	`per_customer_limit` integer DEFAULT 1,
	`is_active` integer DEFAULT true NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `customer_group_members` (
	`customer_id` text NOT NULL,
	`group_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`customer_id`, `group_id`),
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `customer_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `customer_groups` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`discount_percent` real,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`password_hash` text NOT NULL,
	`stripe_customer_id` text,
	`is_verified` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`accepts_marketing` integer DEFAULT false NOT NULL,
	`notes` text,
	`tags` text DEFAULT '[]',
	`last_login_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`variant_id` text NOT NULL,
	`location_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`reserved_quantity` integer DEFAULT 0 NOT NULL,
	`low_stock_threshold` integer DEFAULT 5,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `inventory_locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventory_locations` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`address` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_locations_code_unique` ON `inventory_locations` (`code`);--> statement-breakpoint
CREATE TABLE `inventory_transactions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`variant_id` text NOT NULL,
	`location_id` text NOT NULL,
	`type` text NOT NULL,
	`quantity` integer NOT NULL,
	`reference` text,
	`reference_id` text,
	`note` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `inventory_locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`width` integer,
	`height` integer,
	`alt_text` text,
	`caption` text,
	`url` text NOT NULL,
	`type` text DEFAULT 'image' NOT NULL,
	`group` text,
	`sort_order` integer DEFAULT 0,
	`uploaded_by` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`menu_id` text NOT NULL,
	`parent_id` text,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`type` text DEFAULT 'custom',
	`target` text DEFAULT '_self',
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text,
	`variant_id` text,
	`name` text NOT NULL,
	`variant_name` text,
	`sku` text,
	`quantity` integer NOT NULL,
	`price_cents` integer NOT NULL,
	`tax_cents` integer DEFAULT 0,
	`discount_cents` integer DEFAULT 0,
	`weight` real,
	`image_url` text,
	`is_gift` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `order_status_history` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`order_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`note` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`order_number` text NOT NULL,
	`customer_id` text,
	`email` text NOT NULL,
	`phone` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`subtotal_cents` integer NOT NULL,
	`shipping_cents` integer DEFAULT 0 NOT NULL,
	`tax_cents` integer DEFAULT 0 NOT NULL,
	`discount_cents` integer DEFAULT 0 NOT NULL,
	`total_cents` integer NOT NULL,
	`currency` text DEFAULT 'NPR' NOT NULL,
	`exchange_rate` real DEFAULT 1,
	`payment_method` text,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`shipping_method` text,
	`shipping_cost_cents` integer,
	`coupon_id` text,
	`coupon_code` text,
	`gift_note` text,
	`notes` text,
	`notes_internal` text,
	`ip_address` text,
	`user_agent` text,
	`shipping_address_id` text,
	`shipping_name` text,
	`shipping_phone` text,
	`shipping_line1` text,
	`shipping_line2` text,
	`shipping_city` text,
	`shipping_state` text,
	`shipping_postal_code` text,
	`shipping_country` text,
	`billing_address_id` text,
	`billing_name` text,
	`billing_phone` text,
	`billing_line1` text,
	`billing_line2` text,
	`billing_city` text,
	`billing_state` text,
	`billing_postal_code` text,
	`billing_country` text,
	`stripe_session_id` text,
	`stripe_payment_intent` text,
	`is_gift` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`meta_title` text,
	`meta_description` text,
	`is_published` integer DEFAULT false NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`order_id` text NOT NULL,
	`method` text NOT NULL,
	`transaction_id` text,
	`amount_cents` integer NOT NULL,
	`currency` text DEFAULT 'NPR' NOT NULL,
	`status` text NOT NULL,
	`gateway_response` text,
	`paid_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_categories` (
	`product_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`product_id`, `category_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`sku` text,
	`barcode` text,
	`price_cents` integer NOT NULL,
	`compare_at_price_cents` integer,
	`cost_cents` integer,
	`stock` integer DEFAULT 0,
	`weight` real,
	`weight_unit` text DEFAULT 'kg',
	`image_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`brand` text,
	`tags` text DEFAULT '[]',
	`meta_fields` text DEFAULT '{}',
	`gtin` text,
	`hs_code` text,
	`origin_country` text,
	`seo_title` text,
	`seo_description` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_physical` integer DEFAULT true NOT NULL,
	`min_order_qty` integer DEFAULT 1,
	`max_order_qty` integer,
	`weight` real,
	`weight_unit` text DEFAULT 'kg',
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`payment_id` text NOT NULL,
	`order_id` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`reason` text,
	`status` text NOT NULL,
	`gateway_response` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`product_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`order_id` text,
	`rating` integer NOT NULL,
	`title` text,
	`body` text,
	`is_verified_purchase` integer DEFAULT false NOT NULL,
	`is_approved` integer DEFAULT false NOT NULL,
	`helpful_count` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`user_type` text NOT NULL,
	`token` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`expires_at` text NOT NULL,
	`last_activity_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`type` text DEFAULT 'string' NOT NULL,
	`description` text,
	`is_encrypted` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`order_id` text NOT NULL,
	`carrier` text,
	`tracking_number` text,
	`tracking_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`items` text,
	`shipped_at` text,
	`estimated_delivery_at` text,
	`delivered_at` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `variant_option_links` (
	`variant_id` text NOT NULL,
	`option_id` integer NOT NULL,
	PRIMARY KEY(`variant_id`, `option_id`),
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`option_id`) REFERENCES `variant_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `variant_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` text NOT NULL,
	`group_name` text NOT NULL,
	`value` text NOT NULL,
	`sort_order` integer DEFAULT 0,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wishlist_items` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`wishlist_id` text NOT NULL,
	`product_id` text NOT NULL,
	`variant_id` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`customer_id` text NOT NULL,
	`name` text DEFAULT 'Default' NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
