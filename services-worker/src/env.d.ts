import type { Ai } from "@cloudflare/ai"
import type {
  DurableObjectNamespace,
  KVNamespace,
  D1Database,
  R2Bucket,
  Queue,
} from "@cloudflare/workers-types"

declare global {
  interface Env {
    DB: D1Database
    R2_STORE: R2Bucket
    CACHE: KVNamespace
    AI: Ai
    EMAIL_QUEUE: Queue
    CART_DO: DurableObjectNamespace
    INVENTORY_DO: DurableObjectNamespace
    NOTIFICATION_DO: DurableObjectNamespace
    RESEND_API_KEY: string
  }
}

export {}