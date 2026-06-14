import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"
import { getDb } from "../../../lib/db"
import { reviews, products, customers } from "../../../db/schema"
import { eq, desc } from "drizzle-orm"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const rows = await env.DB.prepare(
      `SELECT r.*, p.name as product_name, c.name as customer_name
       FROM reviews r
       LEFT JOIN products p ON r.product_id = p.id
       LEFT JOIN customers c ON r.customer_id = c.id
       ORDER BY r.created_at DESC`
    ).all<any>()
    return new Response(JSON.stringify(rows.results), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load reviews") }
}
