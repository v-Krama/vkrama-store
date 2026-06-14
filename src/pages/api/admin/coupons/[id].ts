import type { APIRoute } from "astro"
import { getAuthUser } from "../../../../lib/auth"
import { jsonError } from "../../../../lib/validation"

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const row = await env.DB.prepare("SELECT * FROM coupons WHERE id = ?").bind(params.id!).first<any>()
    if (!row) return jsonError(404, "Not found")
    return new Response(JSON.stringify(row), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(500, "Failed to load coupon") }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return jsonError(500, "Server error")
  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")
  try {
    const b = await request.json() as any
    await env.DB.prepare(
      `UPDATE coupons SET code=?, type=?, value_cents=?, value_percent=?, min_order_cents=?, max_discount_cents=?, usage_limit=?, per_customer_limit=?, is_active=?, starts_at=?, ends_at=?, description=?, updated_at=datetime('now') WHERE id=?`,
    ).bind(b.code, b.type, b.valueCents || null, b.valuePercent || null, b.minOrderCents || null, b.maxDiscountCents || null, b.usageLimit || null, b.perCustomerLimit || 1, b.isActive ? 1 : 0, b.startsAt || null, b.endsAt || null, b.description || null, params.id!).run()
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
  } catch { return jsonError(400, "Failed to update coupon") }
}
