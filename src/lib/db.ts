import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

let db: ReturnType<typeof drizzle> | null = null

export function getDb(binding: D1Database) {
  if (!db) {
    db = drizzle(binding, { schema })
  }
  return db
}
