globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsonError, g as getAuthUser } from '../../../../chunks/validation_C3-TSEuz.mjs';
import { s as sendShippingUpdateEmail } from '../../../../chunks/email_CRMb01ci.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const VALID_TRANSITIONS = {
  pending: ["paid", "cancelled"],
  awaiting_payment: ["paid", "cancelled"],
  paid: ["processing", "cancelled", "refunded"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: []
};
const ORDER_STATUSES = ["pending", "awaiting_payment", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];
const GET = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  const id = params.id;
  if (!id) return jsonError(400, "Order ID required");
  try {
    const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
    if (!order) return jsonError(404, "Order not found");
    const items = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(id).all();
    return new Response(
      JSON.stringify({ ...order, items: items.results }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Order GET error:", err);
    return jsonError(500, "Failed to load order");
  }
};
const PUT = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  const id = params.id;
  if (!id) return jsonError(400, "Order ID required");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const newStatus = String(body.status || "").toLowerCase();
    if (!ORDER_STATUSES.includes(newStatus)) {
      return jsonError(400, "Invalid order status");
    }
    const current = await env.DB.prepare("SELECT status, email FROM orders WHERE id = ?").bind(id).first();
    if (!current) return jsonError(404, "Order not found");
    const allowed = VALID_TRANSITIONS[current.status];
    if (!allowed || !allowed.includes(newStatus)) {
      return jsonError(400, `Cannot transition from ${current.status} to ${newStatus}`);
    }
    await env.DB.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(newStatus, id).run();
    if (current.email && ["shipped", "delivered", "processing"].includes(newStatus)) {
      sendShippingUpdateEmail({ email: current.email, orderId: id, status: newStatus }).catch(() => {
      });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return jsonError(400, err.message || "Failed to update order");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
