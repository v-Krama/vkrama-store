globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkAdminAuth } from '../../../../chunks/auth_rVfLOqBr.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "Product ID required" }), { status: 400 });
  try {
    const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!product) return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    const variantOptions = await env.DB.prepare("SELECT * FROM variant_options WHERE product_id = ? ORDER BY sort_order, id").bind(id).all();
    const productVariants = await env.DB.prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order, id").bind(id).all();
    return new Response(JSON.stringify({ ...product, variantOptions: variantOptions.results, productVariants: productVariants.results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Product GET error:", err);
    return new Response(JSON.stringify({ error: "Failed to load product" }), { status: 500 });
  }
};
const PUT = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "Product ID required" }), { status: 400 });
  try {
    const body = await request.json();
    const db = env.DB;
    await db.prepare(
      `UPDATE products SET name = ?, description = ?, price_cents = ?, compare_at_price_cents = ?, stock = ?, status = ?, image_url = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(
      body.name,
      body.description || null,
      Math.round(body.price * 100),
      body.compareAtPrice ? Math.round(body.compareAtPrice * 100) : null,
      body.stock || 0,
      body.status || "draft",
      body.imageUrl || null,
      body.seoTitle || null,
      body.seoDescription || null,
      id
    ).run();
    if (body.variantOptions) {
      let cartesian = function(arrays) {
        if (arrays.length === 0) return [[]];
        const [first, ...rest] = arrays;
        const restCombos = cartesian(rest);
        return first.flatMap((v) => restCombos.map((combo) => [v, ...combo]));
      };
      await db.prepare("DELETE FROM variant_options WHERE product_id = ?").bind(id).run();
      await db.prepare("DELETE FROM product_variants WHERE product_id = ?").bind(id).run();
      for (const opt of body.variantOptions) {
        await db.prepare(
          "INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)"
        ).bind(id, opt.group, opt.value, 0).run();
      }
      const groups = [...new Set(body.variantOptions.map((o) => o.group))];
      const valuesByGroup = groups.map((g) => body.variantOptions.filter((o) => o.group === g).map((o) => o.value));
      const combinations = cartesian(valuesByGroup);
      for (const combo of combinations) {
        const variantName = combo.join(" / ");
        const variantId = "var_" + crypto.randomUUID().slice(0, 20);
        await db.prepare(
          "INSERT INTO product_variants (id, product_id, name, stock, price_cents) VALUES (?, ?, ?, ?, ?)"
        ).bind(variantId, id, variantName, body.stock || 0, body.price ? Math.round(body.price * 100) : null).run();
      }
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to update product" }), { status: 400 });
  }
};
const DELETE = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "Product ID required" }), { status: 400 });
  try {
    await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to delete product" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
