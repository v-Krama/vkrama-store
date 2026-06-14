function getEnv(key: string, fallback = ''): string {
  if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key]
  if (typeof import.meta !== 'undefined') {
    const meta = import.meta as any
    if (meta.env?.[key]) return meta.env[key]
  }
  return fallback
}

export const APP_NAME = getEnv('PUBLIC_APP_NAME', 'vkrama')
export const APP_URL = getEnv('PUBLIC_APP_URL', 'http://localhost:4321')
export const APP_DOMAIN = getEnv('PUBLIC_APP_DOMAIN', 'vkrama.com')

export const CURRENCY = getEnv('PUBLIC_CURRENCY', 'npr')
export const CURRENCY_SYMBOL = getEnv('PUBLIC_CURRENCY_SYMBOL', 'Rs.')
export const SESSION_EXPIRY_DAYS = parseInt(getEnv('SESSION_EXPIRY_DAYS', '30'))
export const ADMIN_SESSION_EXPIRY_HOURS = parseInt(getEnv('ADMIN_SESSION_EXPIRY_HOURS', '12'))
export const PAGINATION_LIMIT = parseInt(getEnv('PAGINATION_LIMIT', '24'))

export const ORDER_STATUSES = ['pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const
export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const

export const SHIPPING_COST_CENTS = parseInt(getEnv('SHIPPING_COST_CENTS', '0'))
export const TAX_RATE = parseFloat(getEnv('TAX_RATE', '0'))
export const FREE_SHIPPING_MINIMUM_CENTS = parseInt(getEnv('FREE_SHIPPING_MINIMUM_CENTS', '500000'))

export const STRIPE_PUBLIC_KEY = getEnv('PUBLIC_STRIPE_KEY', '')
export const R2_PUBLIC_URL = getEnv('PUBLIC_R2_PUBLIC_URL', '')
