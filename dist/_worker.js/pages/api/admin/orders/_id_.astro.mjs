globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../../chunks/auth_B3dqqjmA.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const GET = async ({ params, request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "admin") return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(params.id).first();
  if (!order) return new Response("Not found", { status: 404 });
  const items = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(params.id).all();
  return new Response(JSON.stringify({ ...order, items: items.results }), {
    headers: { "Content-Type": "application/json" }
  });
};
const PUT = async ({ params, request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "admin") return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const { status } = await request.json();
  await env.DB.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, params.id).run();
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
