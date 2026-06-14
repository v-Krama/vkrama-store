globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, i as inArray } from '../../../chunks/db_BOPxdIeH.mjs';
import { j as jsonError, g as getAuthUser, c as generateId, C as CURRENCY, b as jsonOk } from '../../../chunks/validation_C3-TSEuz.mjs';
import { a as sendOrderConfirmationEmail } from '../../../chunks/email_CRMb01ci.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Database not configured");
  const customer = await getAuthUser(request, env.DB, "customer");
  if (!customer) return jsonError(401, "Authentication required");
  const db = getDb(env.DB);
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const { items, paymentMethod, phone, shippingInfo } = body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return jsonError(400, "Cart is empty");
    }
    if (items.length > 50) return jsonError(400, "Too many items in cart");
    const slugs = items.map((i) => String(i.slug).slice(0, 200));
    const productRows = await db.select().from(products).where(inArray(products.slug, slugs)).all();
    const productMap = new Map(productRows.map((p) => [p.slug, p]));
    let subtotalCents = 0;
    const lineItems = [];
    for (const item of items) {
      const qty = Math.min(Math.max(1, Number(item.quantity) || 1), 100);
      const p = productMap.get(item.slug);
      if (!p || p.status !== "active") {
        return jsonError(400, `Product not available: ${item.slug}`);
      }
      if (p.stock < qty) {
        return jsonError(400, `Insufficient stock for ${p.name}`);
      }
      lineItems.push({
        name: item.variantName ? `${p.name} (${item.variantName})` : p.name,
        quantity: qty,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl || void 0,
        slug: item.slug,
        productId: p.id,
        variantId: item.variantId || void 0,
        variantName: item.variantName || void 0
      });
      subtotalCents += p.priceCents * qty;
    }
    const orderId = generateId("ord");
    const shippingCents = 0;
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;
    const orderInsert = env.DB.prepare(
      `INSERT INTO orders (id, customer_id, email, phone, status, subtotal_cents, shipping_cents, tax_cents, total_cents, currency, payment_method, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderId,
      customer.id,
      customer.email,
      phone || null,
      "pending",
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
      shippingInfo?.country || "NP"
    );
    const itemStatements = lineItems.map((item) => ({
      insert: env.DB.prepare(
        "INSERT INTO order_items (id, order_id, product_id, variant_id, name, variant_name, quantity, price_cents, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(generateId("oi"), orderId, item.productId, item.variantId || null, item.name, item.variantName || null, item.quantity, item.priceCents, item.imageUrl || null),
      updateStock: env.DB.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?"
      ).bind(item.quantity, item.productId, item.quantity)
    }));
    const batchOps = [orderInsert];
    for (const s of itemStatements) {
      batchOps.push(s.insert, s.updateStock);
    }
    const batchResults = await env.DB.batch(batchOps);
    const stockFailures = batchResults.filter(
      (r, i) => i >= 2 && i % 2 === 0 && r.meta?.changes === 0
    );
    if (stockFailures.length > 0) {
      await env.DB.batch(
        lineItems.map(
          (item) => env.DB.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").bind(item.quantity, item.productId)
        )
      );
      return jsonError(409, "Stock changed, please review your cart");
    }
    if (customer.email) {
      sendOrderConfirmationEmail({ email: customer.email, orderId, totalCents }).catch(() => {
      });
    }
    return jsonOk({ orderId, totalCents, paymentMethod: paymentMethod || "qr" });
  } catch (err) {
    console.error("Checkout error:", err);
    return jsonError(500, "Checkout failed. Please try again.");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
