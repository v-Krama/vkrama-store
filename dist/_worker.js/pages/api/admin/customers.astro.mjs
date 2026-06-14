globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser } from '../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const result = await env.DB.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
      FROM customers c ORDER BY c.created_at DESC
    `).all();
    return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Customers GET error:", err);
    return jsonError(500, "Failed to load customers");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
