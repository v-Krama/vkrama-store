globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as generateId } from '../../../chunks/auth_BWp464vu.mjs';
import { r as retrievePaymentIntent } from '../../../chunks/payment_BhMckVXS.mjs';
import { C as CURRENCY } from '../../../chunks/constants_CD9_lEZx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
  try {
    const { paymentIntentId, email, phone, shippingInfo, items } = await request.json();
    if (!paymentIntentId) {
      return new Response(JSON.stringify({ error: "Payment required" }), { status: 400 });
    }
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return new Response(JSON.stringify({ error: "Payment not completed" }), { status: 400 });
    }
    const slugs = items.map((i) => i.slug);
    const placeholders = slugs.map(() => "?").join(",");
    const productRows = await env.DB.prepare(
      `SELECT * FROM products WHERE slug IN (${placeholders})`
    ).bind(...slugs).all();
    const productMap = new Map(productRows.results.map((p) => [p.slug, p]));
    let subtotalCents = 0;
    const lineItems = [];
    for (const item of items) {
      const p = productMap.get(item.slug);
      if (!p) continue;
      lineItems.push({
        name: item.variantName ? `${p.name} (${item.variantName})` : p.name,
        quantity: item.quantity,
        priceCents: p.price_cents,
        imageUrl: p.image_url,
        slug: item.slug,
        productId: p.id,
        variantId: item.variantId,
        variantName: item.variantName
      });
      subtotalCents += p.price_cents * item.quantity;
    }
    const shippingCents = shippingInfo ? subtotalCents >= 5e3 ? 0 : 599 : 0;
    const taxCents = Math.round(subtotalCents * 0.08);
    const totalCents = paymentIntent.amount_received || subtotalCents + shippingCents + taxCents;
    const orderId = generateId("ord");
    await env.DB.prepare(
      `INSERT INTO orders (id, email, phone, status, subtotal_cents, shipping_cents, tax_cents, total_cents, currency, payment_method, stripe_payment_intent, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderId,
      email || paymentIntent.receipt_email || "guest@checkout",
      phone || null,
      "paid",
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      CURRENCY,
      "stripe",
      paymentIntentId,
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
        `INSERT INTO order_items (id, order_id, product_id, variant_id, name, variant_name, quantity, price_cents, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(generateId("oi"), orderId, item.productId, item.variantId || null, item.name, item.variantName || null, item.quantity, item.priceCents, item.imageUrl || null).run();
      await env.DB.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").bind(item.quantity, item.productId).run();
    }
    return new Response(JSON.stringify({ orderId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Order placement failed" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
