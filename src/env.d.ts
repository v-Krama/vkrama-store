import type { Ai } from "@cloudflare/ai"
import type { DurableObjectNamespace, KVNamespace, D1Database, R2Bucket, Queue, VectorizeIndex, EmailMessage } from "@cloudflare/workers-types"

declare global {
  interface Env {
    DB: D1Database
    R2_STORE: R2Bucket
    CACHE: KVNamespace
    VECTORIZE: VectorizeIndex
    AI: Ai
    ORDER_QUEUE: Queue
    EMAIL_QUEUE: Queue
    ANALYTICS_QUEUE: Queue
    CART_DO: DurableObjectNamespace
    INVENTORY_DO: DurableObjectNamespace
    NOTIFICATION_DO: DurableObjectNamespace
    EMAIL: EmailMessage
    JWT_SECRET: string
    PUBLIC_APP_URL: string
    PUBLIC_APP_NAME: string
    PUBLIC_ADMIN_SLUG: string
    PUBLIC_STRIPE_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string
    PUBLIC_R2_PUBLIC_URL: string
    PUBLIC_CURRENCY: string
    PUBLIC_CURRENCY_SYMBOL: string
    NODE_VERSION: string
  }
}

export {}
