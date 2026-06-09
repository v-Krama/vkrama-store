globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as calculateShipping, a as calculateTax, b as createPaymentIntent } from '../../../chunks/payment_BhMckVXS.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
  try {
    const { items, shippingInfo } = await request.json();
    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
    }
    const slugs = items.map((i) => i.slug);
    const placeholders = slugs.map(() => "?").join(",");
    const productRows = await env.DB.prepare(
      `SELECT * FROM products WHERE slug IN (${placeholders})`
    ).bind(...slugs).all();
    const productMap = new Map(productRows.results.map((p) => [p.slug, p]));
    let subtotalCents = 0;
    for (const item of items) {
      const p = productMap.get(item.slug);
      if (!p || p.status !== "active") {
        return new Response(JSON.stringify({ error: `Product not available: ${item.slug}` }), { status: 400 });
      }
      subtotalCents += p.price_cents * item.quantity;
    }
    const shippingCents = shippingInfo ? await calculateShipping(subtotalCents) : 0;
    const taxCents = await calculateTax(subtotalCents);
    const totalCents = subtotalCents + shippingCents + taxCents;
    const paymentIntent = await createPaymentIntent({
      amountCents: totalCents,
      metadata: {
        items: JSON.stringify(items.map((i) => ({ slug: i.slug, quantity: i.quantity, variantId: i.variantId, variantName: i.variantName })))
      }
    });
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      totalCents,
      subtotalCents,
      shippingCents,
      taxCents
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Payment setup failed" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
