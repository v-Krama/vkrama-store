globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, i as inArray } from '../../../chunks/db_DGDNi2yE.mjs';
import { g as generateId } from '../../../chunks/auth_BWp464vu.mjs';
import { a as APP_NAME, b as APP_URL, C as CURRENCY } from '../../../chunks/constants_CD9_lEZx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

function formatPrice(cents) {
  return `Rs. ${(cents / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

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
        from: `${APP_NAME} <orders@${undefined                                  || "vkrama.com"}>`,
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
function sendOrderConfirmationEmail(params) {
  return sendEmail({
    to: params.email,
    subject: `Order Confirmed #${params.orderId.slice(-8)} — ${APP_NAME}`,
    html: `
      <html><head><style>${baseStyles}</style></head><body>
        <div class="container">
          <div class="header">
            <div class="logo">${APP_NAME}</div>
          </div>
          <div class="card">
            <h1 style="margin:0 0 8px; font-size:24px; color: #111827;">Thank you for your order!</h1>
            <p style="color: #64748b; margin:0 0 24px;">Your order has been confirmed and is being processed.</p>
            <table style="width:100%; margin-bottom:24px;">
              <tr><td style="color:#64748b; padding:8px 0;">Order</td><td style="font-weight:600; text-align:right;">#${params.orderId.slice(-8)}</td></tr>
              <tr><td style="color:#64748b; padding:8px 0;">Total</td><td style="font-weight:600; text-align:right;">${formatPrice(params.totalCents)}</td></tr>
            </table>
            <div style="text-align:center;">
              <a href="${APP_URL}/account/orders/${params.orderId}" class="btn">View Order</a>
            </div>
          </div>
          <div class="footer">
            <p>${APP_NAME} — Quality products, fair prices.</p>
            <p style="margin:4px 0 0;">${APP_URL}</p>
          </div>
        </div>
      </body></html>
    `
  });
}

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
  }
  const db = getDb(env.DB);
  try {
    const { items, paymentMethod, email, shippingInfo } = await request.json();
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
    }
    const isStripe = paymentMethod !== "cod" && paymentMethod !== "qr";
    const status = isStripe ? "awaiting_payment" : "pending";
    const slugs = items.map((i) => i.slug);
    const productRows = await db.select().from(products).where(inArray(products.slug, slugs)).all();
    const productMap = new Map(productRows.map((p) => [p.slug, p]));
    let subtotalCents = 0;
    const lineItems = [];
    for (const item of items) {
      const p = productMap.get(item.slug);
      if (!p || p.status !== "active") {
        return new Response(JSON.stringify({ error: `Product not found: ${item.slug}` }), { status: 400 });
      }
      if (p.stock < item.quantity) {
        return new Response(JSON.stringify({ error: `Insufficient stock: ${p.name}` }), { status: 400 });
      }
      lineItems.push({
        name: item.variantName ? `${p.name} (${item.variantName})` : p.name,
        quantity: item.quantity,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl || void 0,
        slug: item.slug,
        productId: p.id,
        variantId: item.variantId,
        variantName: item.variantName
      });
      subtotalCents += p.priceCents * item.quantity;
    }
    const orderId = generateId("ord");
    const shippingCents = 0;
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;
    await env.DB.prepare(
      `INSERT INTO orders (id, email, phone, status, subtotal_cents, shipping_cents, tax_cents, total_cents, currency, payment_method, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderId,
      email || "guest@checkout",
      shippingInfo?.phone || null,
      status,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      CURRENCY,
      paymentMethod || "qr",
      shippingInfo?.name || null,
      shippingInfo?.phone || null,
      shippingInfo?.line1 || null,
      shippingInfo?.line2 || null,
      shippingInfo?.city || null,
      shippingInfo?.state || null,
      shippingInfo?.postalCode || null,
      shippingInfo?.country || "US"
    ).run();
    for (const item of lineItems) {
      await env.DB.prepare(
        "INSERT INTO order_items (id, order_id, product_id, variant_id, name, variant_name, quantity, price_cents, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(generateId("oi"), orderId, item.productId, item.variantId || null, item.name, item.variantName || null, item.quantity, item.priceCents, item.imageUrl || null).run();
      await env.DB.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").bind(item.quantity, item.productId).run();
    }
    if (email) {
      sendOrderConfirmationEmail({ email, orderId, totalCents }).catch(() => {
      });
    }
    return new Response(JSON.stringify({ orderId, totalCents, paymentMethod: paymentMethod || "qr" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "Checkout failed. Please try again." }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
