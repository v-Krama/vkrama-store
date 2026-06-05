export const APP_NAME = import.meta.env.PUBLIC_APP_NAME || 'vkrama'
export const APP_URL = import.meta.env.PUBLIC_APP_URL || 'http://localhost:4321'
export const CURRENCY = 'usd'
export const SESSION_EXPIRY_DAYS = 30
export const ADMIN_SESSION_EXPIRY_HOURS = 12
export const PAGINATION_LIMIT = 24

export const ORDER_STATUSES = ['pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const
export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const

export const SHIPPING_COST_CENTS = 0
export const TAX_RATE = 0
export const FREE_SHIPPING_MINIMUM_CENTS = 5000

export const STRIPE_PUBLIC_KEY = import.meta.env.PUBLIC_STRIPE_KEY || ''

export const R2_PUBLIC_URL = import.meta.env.PUBLIC_R2_PUBLIC_URL || ''
