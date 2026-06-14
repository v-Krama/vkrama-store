globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsonError, g as getAuthUser, s as sanitizeString, c as generateId } from '../../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  const id = params.id;
  if (!id) return jsonError(400, "Product ID required");
  try {
    const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!product) return jsonError(404, "Product not found");
    const variantOptions = await env.DB.prepare(
      "SELECT * FROM variant_options WHERE product_id = ? ORDER BY sort_order, id"
    ).bind(id).all();
    const productVariants = await env.DB.prepare(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order, id"
    ).bind(id).all();
    return new Response(
      JSON.stringify({ ...product, variantOptions: variantOptions.results, productVariants: productVariants.results }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Product GET error:", err);
    return jsonError(500, "Failed to load product");
  }
};
const PUT = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  const id = params.id;
  if (!id) return jsonError(400, "Product ID required");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const price = Number(body.price) || 0;
    await env.DB.prepare(
      `UPDATE products SET name = ?, description = ?, price_cents = ?, compare_at_price_cents = ?, stock = ?, status = ?, image_url = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(
      sanitizeString(body.name, 200),
      sanitizeString(body.description, 5e3) || null,
      Math.round(price * 100),
      body.compareAtPrice ? Math.round(Number(body.compareAtPrice) * 100) : null,
      Math.min(Math.max(0, Number(body.stock) || 0), 999999),
      body.status || "draft",
      sanitizeString(body.imageUrl, 500) || null,
      sanitizeString(body.seoTitle, 200) || null,
      sanitizeString(body.seoDescription, 300) || null,
      id
    ).run();
    if (body.variantOptions) {
      let cartesian = function(arrays) {
        if (arrays.length === 0) return [[]];
        const [first, ...rest] = arrays;
        const restCombos = cartesian(rest);
        return first.flatMap((v) => restCombos.map((combo) => [v, ...combo]));
      };
      await env.DB.prepare("DELETE FROM variant_options WHERE product_id = ?").bind(id).run();
      await env.DB.prepare("DELETE FROM product_variants WHERE product_id = ?").bind(id).run();
      const variantOptions = body.variantOptions;
      for (const opt of variantOptions) {
        await env.DB.prepare(
          "INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)"
        ).bind(id, sanitizeString(opt.group, 50), sanitizeString(opt.value, 100), 0).run();
      }
      const groups = [...new Set(variantOptions.map((o) => o.group))];
      const valuesByGroup = groups.map((g) => variantOptions.filter((o) => o.group === g).map((o) => o.value));
      const combinations = cartesian(valuesByGroup);
      for (const combo of combinations) {
        const variantName = combo.join(" / ");
        const variantId = generateId("var");
        await env.DB.prepare(
          "INSERT INTO product_variants (id, product_id, name, stock, price_cents) VALUES (?, ?, ?, ?, ?)"
        ).bind(variantId, id, variantName, Math.min(Math.max(0, Number(body.stock) || 0), 999999), Math.round(price * 100)).run();
      }
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return jsonError(400, err.message || "Failed to update product");
  }
};
const DELETE = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  const id = params.id;
  if (!id) return jsonError(400, "Product ID required");
  try {
    await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return jsonError(400, err.message || "Failed to delete product");
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
