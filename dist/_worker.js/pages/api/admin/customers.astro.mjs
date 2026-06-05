globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../chunks/auth_BKtXvTES.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const GET = async ({ request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "admin") return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const result = await env.DB.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
    FROM customers c ORDER BY c.created_at DESC
  `).all();
  return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
