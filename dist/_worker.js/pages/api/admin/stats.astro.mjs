globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser } from '../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({}), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const [revenue, orders, products, active, customers, pending, reviews, coupons, lowStock] = await Promise.all([
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
      ).first()
    ]);
    const recentOrders = await env.DB.prepare(
      "SELECT id, order_number, total_cents, status, created_at, email FROM orders ORDER BY created_at DESC LIMIT 5"
    ).all();
    const totals = {};
    for (const row of [revenue, orders, products, active, customers, pending, reviews, coupons, lowStock]) {
      const r = row;
      if (r) totals[r.column || "value"] = r.total ?? r.count ?? 0;
    }
    return new Response(
      JSON.stringify({
        totalRevenueCents: revenue?.total || 0,
        totalOrders: orders?.count || 0,
        totalProducts: products?.count || 0,
        activeProducts: active?.count || 0,
        totalCustomers: customers?.count || 0,
        pendingOrders: pending?.count || 0,
        totalReviews: reviews?.count || 0,
        totalCoupons: coupons?.count || 0,
        lowStockCount: lowStock?.count || 0,
        recentOrders: recentOrders.results
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Stats API error:", err);
    return jsonError(500, "Failed to load dashboard stats");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
