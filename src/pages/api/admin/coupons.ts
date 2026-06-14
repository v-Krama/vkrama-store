import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"
import { getDb } from "../../../lib/db"
import { coupons } from "../../../db/schema"
import { eq, desc } from "drizzle-orm"
import { nanoid } from "nanoid"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const db = getDb(env.DB)
    const result = await db.select().from(coupons).orderBy(desc(coupons.createdAt)).all()
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load coupons") }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const body = await request.json(); const b = body as any
    const id = "coup_" + nanoid(24)
    await env.DB.prepare(
      `INSERT INTO coupons (id, code, type, value_cents, value_percent, min_order_cents, max_discount_cents, usage_limit, per_customer_limit, is_active, starts_at, ends_at, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, b.code, b.type, b.valueCents || null, b.valuePercent || null, b.minOrderCents || null, b.maxDiscountCents || null, b.usageLimit || null, b.perCustomerLimit || 1, b.isActive ? 1 : 0, b.startsAt || null, b.endsAt || null, b.description || null).run()
    return new Response(JSON.stringify({ id }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to create coupon") }
}
