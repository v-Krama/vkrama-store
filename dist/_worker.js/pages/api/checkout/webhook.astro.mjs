globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as constructWebhookEvent } from '../../../chunks/payment_BhMckVXS.mjs';
import { C as CURRENCY } from '../../../chunks/constants_BUEnnsFf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
  const secret = "whsec_placeholder";
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";
    const event = await constructWebhookEvent(body, signature, secret);
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const items = pi.metadata?.items ? JSON.parse(pi.metadata.items) : [];
      if (items.length > 0) {
        const slugs = items.map((i) => i.slug);
        const placeholders = slugs.map(() => "?").join(",");
        const productRows = await env.DB.prepare(
          `SELECT * FROM products WHERE slug IN (${placeholders})`
        ).bind(...slugs).all();
        const productMap = new Map(productRows.results.map((p) => [p.slug, p]));
        let subtotalCents = 0;
        for (const item of items) {
          const p = productMap.get(item.slug);
          if (p) {
            subtotalCents += p.price_cents * item.quantity;
            await env.DB.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").bind(item.quantity, p.id).run();
          }
        }
        const shippingCents = subtotalCents >= 5e3 ? 0 : 599;
        const taxCents = Math.round(subtotalCents * 0.08);
        const { nanoid } = await import('../../../chunks/index.browser_DZKJnQ_o.mjs');
        const orderId = `ord_${nanoid(24)}`;
        await env.DB.prepare(
          `INSERT INTO orders (id, email, status, subtotal_cents, shipping_cents, tax_cents, total_cents, currency, payment_method, stripe_payment_intent)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(orderId, pi.receipt_email || "guest@checkout", "paid", subtotalCents, shippingCents, taxCents, pi.amount_received / 100, CURRENCY, "stripe", pi.id).run();
        await env.DB.prepare("UPDATE orders SET stripe_payment_intent = ? WHERE id = ?").bind(pi.id, orderId).run();
        console.log(`Order ${orderId} created via webhook`);
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return new Response(JSON.stringify({ error: "Webhook error" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
