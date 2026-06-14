import type { APIRoute } from "astro"
import { getAuthUser } from "../../../lib/auth"
import { jsonError } from "../../../lib/validation"

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env
  if (!env?.DB) return new Response(JSON.stringify({}), { status: 200 })

  const user = await getAuthUser(request, env.DB, "admin")
  if (!user) return jsonError(401, "Unauthorized")

  try {
    const [revenue, orders, products, active, customers, pending, reviews, coupons, lowStock] =
      await Promise.all([
        env.DB.prepare("SELECT COALESCE(SUM(total_cents), 0) as total FROM orders WHERE status IN ('paid','processing','shipped','delivered')").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM orders").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM products").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'active'").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM customers").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM reviews WHERE is_approved = 0").first(),
        env.DB.prepare("SELECT COUNT(*) as count FROM coupons WHERE is_active = 1").first(),
        env.DB.prepare(
          "SELECT COUNT(*) as count FROM product_variants WHERE stock > 0 AND stock <= 5"
        ).first(),
      ])

    const recentOrders = await env.DB.prepare(
      "SELECT id, order_number, total_cents, status, created_at, email FROM orders ORDER BY created_at DESC LIMIT 5",
    ).all()

    const totals: Record<string, any> = {}
    for (const row of [revenue, orders, products, active, customers, pending, reviews, coupons, lowStock]) {
      const r = row as any
      if (r) totals[r.column || "value"] = r.total ?? r.count ?? 0
    }

    return new Response(
      JSON.stringify({
        totalRevenueCents: (revenue as any)?.total || 0,
        totalOrders: (orders as any)?.count || 0,
        totalProducts: (products as any)?.count || 0,
        activeProducts: (active as any)?.count || 0,
        totalCustomers: (customers as any)?.count || 0,
        pendingOrders: (pending as any)?.count || 0,
        totalReviews: (reviews as any)?.count || 0,
        totalCoupons: (coupons as any)?.count || 0,
        lowStockCount: (lowStock as any)?.count || 0,
        recentOrders: recentOrders.results,
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    console.error("Stats API error:", err)
    return jsonError(500, "Failed to load dashboard stats")
  }
}
