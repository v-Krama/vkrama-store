globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkAdminAuth } from '../../../../chunks/auth_C4GgaQbx.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const GET = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "Order ID required" }), { status: 400 });
  try {
    const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
    if (!order) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    const items = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(id).all();
    return new Response(JSON.stringify({ ...order, items: items.results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Order GET error:", err);
    return new Response(JSON.stringify({ error: "Failed to load order" }), { status: 500 });
  }
};
const PUT = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "Order ID required" }), { status: 400 });
  try {
    const { status } = await request.json();
    if (!status) return new Response(JSON.stringify({ error: "Status required" }), { status: 400 });
    await env.DB.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(status, id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to update order" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
