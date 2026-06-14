globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser } from '../../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError } from '../../../../chunks/validation_DU1POphA.mjs';
import { A as APP_NAME, a as APP_URL } from '../../../../chunks/constants_GLW3iTdd.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const resendKey = "re_placeholder";
async function sendEmail({ to, subject, html }) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `${APP_NAME} <orders@${"vkrama.com.np"}>`,
        to,
        subject,
        html
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}
const baseStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
  .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
  .header { text-align: center; padding: 32px 0; }
  .logo { font-size: 28px; font-weight: 800; color: #2563EB; letter-spacing: -0.5px; }
  .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
  .btn { display: inline-block; background: #2563EB; color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; }
  .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }
`;
function sendShippingUpdateEmail(params) {
  const statusLabels = {
    processing: "is being processed",
    shipped: "has been shipped",
    delivered: "has been delivered"
  };
  return sendEmail({
    to: params.email,
    subject: `Order Update #${params.orderId.slice(-8)} — ${APP_NAME}`,
    html: `
      <html><head><style>${baseStyles}</style></head><body>
        <div class="container">
          <div class="header"><div class="logo">${APP_NAME}</div></div>
          <div class="card">
            <h1 style="margin:0 0 8px; font-size:24px; color:#111827;">Order Update</h1>
            <p style="color:#64748b; margin:0 0 24px;">Your order #${params.orderId.slice(-8)} ${statusLabels[params.status] || "has been updated"}.</p>
            <div style="text-align:center;">
              <a href="${APP_URL}/account/orders/${params.orderId}" class="btn">View Order</a>
            </div>
          </div>
          <div class="footer">
            <p>${APP_NAME}</p>
          </div>
        </div>
      </body></html>
    `
  });
}

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
