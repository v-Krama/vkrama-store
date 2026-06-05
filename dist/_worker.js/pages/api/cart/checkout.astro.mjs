globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, i as inArray } from '../../../chunks/db_BrnEeMLF.mjs';
import { g as generateId } from '../../../chunks/auth_DQG_9vYb.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

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
      "usd",
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
    return new Response(JSON.stringify({ orderId, totalCents, paymentMethod: paymentMethod || "qr" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Checkout failed" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
