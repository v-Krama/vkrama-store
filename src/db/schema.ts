import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core"
import { sql, relations } from "drizzle-orm"
import type { InferSelectModel, InferInsertModel } from "drizzle-orm"

const id = () => text("id").primaryKey()
const ulid = () =>
  text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`)
const timestamp = (name: string) => text(name).notNull().default(sql`(datetime('now'))`)
const optionalTimestamp = (name: string) => text(name)
const bool = (name: string) => integer(name, { mode: "boolean" }).notNull().default(false)
const json = <T>(name: string) => text(name, { mode: "json" }).$type<T>()

// ─── PRODUCTS & CATALOG ───────────────────────────────────────────

export const products = sqliteTable("products", {
  id: ulid(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  brand: text("brand"),
  tags: json<string[]>("tags").default([]),
  metaFields: json<Record<string, string>>("meta_fields").default({}),
  gtin: text("gtin"),
  hsCode: text("hs_code"),
  originCountry: text("origin_country"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  isFeatured: bool("is_featured"),
  isPhysical: bool("is_physical").default(true),
  minOrderQty: integer("min_order_qty").default(1),
  maxOrderQty: integer("max_order_qty"),
  weight: real("weight"),
  weightUnit: text("weight_unit").default("kg"),
  status: text("status", { enum: ["draft", "active", "archived"] })
    .notNull()
    .default("draft"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const productVariants = sqliteTable("product_variants", {
  id: ulid(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku"),
  barcode: text("barcode"),
  priceCents: integer("price_cents").notNull(),
  compareAtPriceCents: integer("compare_at_price_cents"),
  costCents: integer("cost_cents"),
  stock: integer("stock").default(0),
  weight: real("weight"),
  weightUnit: text("weight_unit").default("kg"),
  imageUrl: text("image_url"),
  isActive: bool("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const variantOptions = sqliteTable("variant_options", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  groupName: text("group_name").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").default(0),
})

export const variantOptionLinks = sqliteTable(
  "variant_option_links",
  {
    variantId: text("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    optionId: integer("option_id")
      .notNull()
      .references(() => variantOptions.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.variantId, t.optionId] }) }),
)

export const categories = sqliteTable("categories", {
  id: ulid(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: text("parent_id"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  isActive: bool("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const productCategories = sqliteTable(
  "product_categories",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.categoryId] }) }),
)

// ─── INVENTORY ─────────────────────────────────────────────────────

export const inventoryLocations = sqliteTable("inventory_locations", {
  id: ulid(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address"),
  isActive: bool("is_active").default(true),
  createdAt: timestamp("created_at"),
})

export const inventory = sqliteTable("inventory", {
  id: ulid(),
  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  locationId: text("location_id")
    .notNull()
    .references(() => inventoryLocations.id),
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const inventoryTransactions = sqliteTable("inventory_transactions", {
  id: ulid(),
  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  locationId: text("location_id")
    .notNull()
    .references(() => inventoryLocations.id),
  type: text("type", {
    enum: ["in", "out", "reserve", "release", "adjustment"],
  }).notNull(),
  quantity: integer("quantity").notNull(),
  reference: text("reference"),
  referenceId: text("reference_id"),
  note: text("note"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at"),
})

// ─── CUSTOMERS ─────────────────────────────────────────────────────

export const customers = sqliteTable("customers", {
  id: ulid(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  isVerified: bool("is_verified").default(false),
  isActive: bool("is_active").default(true),
  acceptsMarketing: bool("accepts_marketing").default(false),
  notes: text("notes"),
  tags: json<string[]>("tags").default([]),
  lastLoginAt: optionalTimestamp("last_login_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const customerGroups = sqliteTable("customer_groups", {
  id: ulid(),
  name: text("name").notNull(),
  description: text("description"),
  discountPercent: real("discount_percent"),
  isActive: bool("is_active").default(true),
  createdAt: timestamp("created_at"),
})

export const customerGroupMembers = sqliteTable(
  "customer_group_members",
  {
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => customerGroups.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.customerId, t.groupId] }) }),
)

export const addresses = sqliteTable("addresses", {
  id: ulid(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  label: text("label").default("Home"),
  name: text("name").notNull(),
  phone: text("phone"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country").notNull().default("NP"),
  isShippingDefault: bool("is_shipping_default").default(false),
  isBillingDefault: bool("is_billing_default").default(false),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

// ─── WISHLISTS ─────────────────────────────────────────────────────

export const wishlists = sqliteTable("wishlists", {
  id: ulid(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  name: text("name").notNull().default("Default"),
  isPublic: bool("is_public").default(false),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const wishlistItems = sqliteTable("wishlist_items", {
  id: ulid(),
  wishlistId: text("wishlist_id")
    .notNull()
    .references(() => wishlists.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id").references(() => productVariants.id),
  notes: text("notes"),
  createdAt: timestamp("created_at"),
})

// ─── ORDERS ────────────────────────────────────────────────────────

export const orders = sqliteTable("orders", {
  id: ulid(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: text("customer_id").references(() => customers.id),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status", {
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
      "partially_refunded",
    ],
  })
    .notNull()
    .default("pending"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  discountCents: integer("discount_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").notNull().default("NPR"),
  exchangeRate: real("exchange_rate").default(1),
  paymentMethod: text("payment_method", {
    enum: ["cash", "qr", "stripe", "khalti", "esewa", "bank_transfer"],
  }),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
  })
    .notNull()
    .default("pending"),
  shippingMethod: text("shipping_method"),
  shippingCostCents: integer("shipping_cost_cents"),
  couponId: text("coupon_id"),
  couponCode: text("coupon_code"),
  giftNote: text("gift_note"),
  notes: text("notes"),
  notesInternal: text("notes_internal"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  shippingAddressId: text("shipping_address_id"),
  shippingName: text("shipping_name"),
  shippingPhone: text("shipping_phone"),
  shippingLine1: text("shipping_line1"),
  shippingLine2: text("shipping_line2"),
  shippingCity: text("shipping_city"),
  shippingState: text("shipping_state"),
  shippingPostalCode: text("shipping_postal_code"),
  shippingCountry: text("shipping_country"),
  billingAddressId: text("billing_address_id"),
  billingName: text("billing_name"),
  billingPhone: text("billing_phone"),
  billingLine1: text("billing_line1"),
  billingLine2: text("billing_line2"),
  billingCity: text("billing_city"),
  billingState: text("billing_state"),
  billingPostalCode: text("billing_postal_code"),
  billingCountry: text("billing_country"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntent: text("stripe_payment_intent"),
  isGift: bool("is_gift").default(false),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const orderItems = sqliteTable("order_items", {
  id: ulid(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id"),
  variantId: text("variant_id"),
  name: text("name").notNull(),
  variantName: text("variant_name"),
  sku: text("sku"),
  quantity: integer("quantity").notNull(),
  priceCents: integer("price_cents").notNull(),
  taxCents: integer("tax_cents").default(0),
  discountCents: integer("discount_cents").default(0),
  weight: real("weight"),
  imageUrl: text("image_url"),
  isGift: bool("is_gift").default(false),
})

export const orderStatusHistory = sqliteTable("order_status_history", {
  id: ulid(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  note: text("note"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at"),
})

// ─── PAYMENTS ──────────────────────────────────────────────────────

export const payments = sqliteTable("payments", {
  id: ulid(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  method: text("method", {
    enum: ["cash", "qr", "stripe", "khalti", "esewa", "bank_transfer"],
  }).notNull(),
  transactionId: text("transaction_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("NPR"),
  status: text("status", {
    enum: ["pending", "succeeded", "failed", "refunded"],
  }).notNull(),
  gatewayResponse: json<Record<string, unknown>>("gateway_response"),
  paidAt: optionalTimestamp("paid_at"),
  createdAt: timestamp("created_at"),
})

export const refunds = sqliteTable("refunds", {
  id: ulid(),
  paymentId: text("payment_id")
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  reason: text("reason"),
  status: text("status", {
    enum: ["pending", "completed", "failed"],
  }).notNull(),
  gatewayResponse: json<Record<string, unknown>>("gateway_response"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at"),
})

// ─── SHIPMENTS ─────────────────────────────────────────────────────

export const shipments = sqliteTable("shipments", {
  id: ulid(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  carrier: text("carrier"),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  status: text("status", {
    enum: ["pending", "labeled", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"],
  })
    .notNull()
    .default("pending"),
  items: json<{ orderItemId: string; quantity: number }[]>("items"),
  shippedAt: optionalTimestamp("shipped_at"),
  estimatedDeliveryAt: optionalTimestamp("estimated_delivery_at"),
  deliveredAt: optionalTimestamp("delivered_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

// ─── REVIEWS ───────────────────────────────────────────────────────

export const reviews = sqliteTable("reviews", {
  id: ulid(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  orderId: text("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body"),
  isVerifiedPurchase: bool("is_verified_purchase").default(false),
  isApproved: bool("is_approved").default(false),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at"),
})

// ─── MARKETING & PROMOTIONS ────────────────────────────────────────

export const coupons = sqliteTable("coupons", {
  id: ulid(),
  code: text("code").notNull().unique(),
  type: text("type", { enum: ["percent", "fixed"] }).notNull(),
  valueCents: integer("value_cents"),
  valuePercent: real("value_percent"),
  minOrderCents: integer("min_order_cents"),
  maxDiscountCents: integer("max_discount_cents"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  perCustomerLimit: integer("per_customer_limit").default(1),
  isActive: bool("is_active").default(true),
  startsAt: optionalTimestamp("starts_at"),
  endsAt: optionalTimestamp("ends_at"),
  description: text("description"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const couponUsages = sqliteTable("coupon_usages", {
  id: ulid(),
  couponId: text("coupon_id")
    .notNull()
    .references(() => coupons.id, { onDelete: "cascade" }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  customerId: text("customer_id").references(() => customers.id),
  discountCents: integer("discount_cents").notNull(),
  createdAt: timestamp("created_at"),
})

export const collections = sqliteTable("collections", {
  id: ulid(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: bool("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const collectionProducts = sqliteTable(
  "collection_products",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0),
  },
  (t) => ({ pk: primaryKey({ columns: [t.collectionId, t.productId] }) }),
)

// ─── CONTENT ───────────────────────────────────────────────────────

export const pages = sqliteTable("pages", {
  id: ulid(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isPublished: bool("is_published").default(false),
  publishedAt: optionalTimestamp("published_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const menus = sqliteTable("menus", {
  id: ulid(),
  name: text("name").notNull(),
  location: text("location", {
    enum: ["header", "footer", "sidebar", "mobile"],
  }).notNull(),
  isActive: bool("is_active").default(true),
  createdAt: timestamp("created_at"),
})

export const menuItems = sqliteTable("menu_items", {
  id: ulid(),
  menuId: text("menu_id")
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type", {
    enum: ["page", "product", "category", "collection", "custom"],
  }).default("custom"),
  target: text("target").default("_self"),
  sortOrder: integer("sort_order").default(0),
})

export const media = sqliteTable("media", {
  id: ulid(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  caption: text("caption"),
  url: text("url").notNull(),
  type: text("type", {
    enum: ["image", "document", "video", "audio"],
  }).notNull().default("image"),
  group: text("group"),
  sortOrder: integer("sort_order").default(0),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at"),
})

// ─── SETTINGS ──────────────────────────────────────────────────────

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  type: text("type", { enum: ["string", "number", "boolean", "json"] }).notNull().default("string"),
  description: text("description"),
  isEncrypted: bool("is_encrypted").default(false),
  updatedAt: timestamp("updated_at"),
})

// ─── SYSTEM ────────────────────────────────────────────────────────

export const sessions = sqliteTable("sessions", {
  id: ulid(),
  userId: text("user_id").notNull(),
  userType: text("user_type", { enum: ["customer", "admin"] }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: text("expires_at").notNull(),
  lastActivityAt: optionalTimestamp("last_activity_at"),
  createdAt: timestamp("created_at"),
})

export const admins = sqliteTable("admins", {
  id: ulid(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["superadmin", "admin", "manager", "support"] })
    .notNull()
    .default("admin"),
  permissions: json<string[]>("permissions").default([]),
  isActive: bool("is_active").default(true),
  lastLoginAt: optionalTimestamp("last_login_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const verificationTokens = sqliteTable("verification_tokens", {
  id: ulid(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  type: text("type", { enum: ["email_verify", "password_reset"] }).notNull(),
  expiresAt: text("expires_at").notNull(),
  usedAt: optionalTimestamp("used_at"),
  createdAt: timestamp("created_at"),
})

export const activityLog = sqliteTable("activity_log", {
  id: ulid(),
  actorType: text("actor_type", { enum: ["customer", "admin", "system"] }).notNull(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  metadata: json<Record<string, unknown>>("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at"),
})

// ─── RELATIONS ─────────────────────────────────────────────────────

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  options: many(variantOptions),
  categories: many(productCategories),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
  collectionProducts: many(collectionProducts),
}))

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  optionLinks: many(variantOptionLinks),
  inventory: many(inventory),
  transactions: many(inventoryTransactions),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlists: many(wishlists),
  groups: many(customerGroupMembers),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  payments: many(payments),
  refunds: many(refunds),
  shipments: many(shipments),
}))

// ─── EXPORT TYPES ──────────────────────────────────────────────────

export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>
export type ProductVariant = InferSelectModel<typeof productVariants>
export type NewProductVariant = InferInsertModel<typeof productVariants>
export type Category = InferSelectModel<typeof categories>
export type Customer = InferSelectModel<typeof customers>
export type Address = InferSelectModel<typeof addresses>
export type Order = InferSelectModel<typeof orders>
export type OrderItem = InferSelectModel<typeof orderItems>
export type OrderStatusHistory = InferSelectModel<typeof orderStatusHistory>
export type Payment = InferSelectModel<typeof payments>
export type Refund = InferSelectModel<typeof refunds>
export type Shipment = InferSelectModel<typeof shipments>
export type Coupon = InferSelectModel<typeof coupons>
export type Review = InferSelectModel<typeof reviews>
export type Admin = InferSelectModel<typeof admins>
export type Session = InferSelectModel<typeof sessions>
export type Media = InferSelectModel<typeof media>
export type Page = InferSelectModel<typeof pages>
export type Setting = InferSelectModel<typeof settings>
export type Inventory = InferSelectModel<typeof inventory>
export type InventoryTransaction = InferSelectModel<typeof inventoryTransactions>
export type Wishlist = InferSelectModel<typeof wishlists>
export type WishlistItem = InferSelectModel<typeof wishlistItems>
export type Collection = InferSelectModel<typeof collections>
export type Menu = InferSelectModel<typeof menus>
export type MenuItem = InferSelectModel<typeof menuItems>
