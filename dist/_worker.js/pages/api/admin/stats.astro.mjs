globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser, j as jsonError } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({}), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const totalRevenue = await env.DB.prepare(
      "SELECT COALESCE(SUM(total_cents), 0) as total FROM orders WHERE status IN ('paid','processing','shipped','delivered')"
    ).first();
    const totalOrders = await env.DB.prepare("SELECT COUNT(*) as count FROM orders").first();
    const totalProducts = await env.DB.prepare("SELECT COUNT(*) as count FROM products").first();
    const activeProducts = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM products WHERE status = 'active'"
    ).first();
    const totalCustomers = await env.DB.prepare("SELECT COUNT(*) as count FROM customers").first();
    const pendingOrders = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
    ).first();
    const recentOrders = await env.DB.prepare(
      "SELECT id, total_cents, status, created_at, email FROM orders ORDER BY created_at DESC LIMIT 5"
    ).all();
    return new Response(JSON.stringify({
      totalRevenueCents: totalRevenue?.total || 0,
      totalOrders: totalOrders?.count || 0,
      totalProducts: totalProducts?.count || 0,
      activeProducts: activeProducts?.count || 0,
      totalCustomers: totalCustomers?.count || 0,
      pendingOrders: pendingOrders?.count || 0,
      recentOrders: recentOrders.results
    }), { headers: { "Content-Type": "application/json" } });
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
