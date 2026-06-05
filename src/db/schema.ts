import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  compareAtPriceCents: integer('compare_at_price_cents'),
  costCents: integer('cost_cents'),
  stock: integer('stock').default(0),
  status: text('status').default('draft'),
  imageUrl: text('image_url'),
  images: text('images'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  weight: real('weight'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sku: text('sku'),
  priceCents: integer('price_cents'),
  stock: integer('stock').default(0),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const variantOptions = sqliteTable('variant_options', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  groupName: text('group_name').notNull(),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').default(0),
})

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  parentId: text('parent_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const productCategories = sqliteTable('product_categories', {
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
})

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  phone: text('phone'),
  passwordHash: text('password_hash').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const addresses = sqliteTable('addresses', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  label: text('label').default('Home'),
  name: text('name').notNull(),
  phone: text('phone'),
  line1: text('line1').notNull(),
  line2: text('line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').default('US'),
  isDefault: integer('is_default').default(0),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').references(() => customers.id),
  email: text('email').notNull(),
  phone: text('phone'),
  status: text('status').default('pending'),
  subtotalCents: integer('subtotal_cents').notNull(),
  shippingCents: integer('shipping_cents').default(0),
  taxCents: integer('tax_cents').default(0),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency').default('npr'),
  paymentMethod: text('payment_method').default('stripe'),
  stripeSessionId: text('stripe_session_id'),
  stripePaymentIntent: text('stripe_payment_intent'),
  shippingAddressId: text('shipping_address_id').references(() => addresses.id),
  shippingName: text('shipping_name'),
  shippingPhone: text('shipping_phone'),
  shippingLine1: text('shipping_line1'),
  shippingLine2: text('shipping_line2'),
  shippingCity: text('shipping_city'),
  shippingState: text('shipping_state'),
  shippingPostalCode: text('shipping_postal_code'),
  shippingCountry: text('shipping_country').default('US'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  variantId: text('variant_id'),
  name: text('name').notNull(),
  variantName: text('variant_name'),
  quantity: integer('quantity').notNull(),
  priceCents: integer('price_cents').notNull(),
  imageUrl: text('image_url'),
})

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userType: text('user_type').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})
