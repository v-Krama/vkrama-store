globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, d as desc } from '../../../chunks/db_BOPxdIeH.mjs';
import { g as getAuthUser, j as jsonError, s as sanitizeString, k as validatePrice, c as generateId } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const db = getDb(env.DB);
    const result = await db.select().from(products).orderBy(desc(products.createdAt)).all();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Products GET error:", err);
    return jsonError(500, "Failed to load products");
  }
};
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const name = sanitizeString(body.name, 200);
    if (!name) return jsonError(400, "Product name is required");
    const price = Number(body.price) || 0;
    const priceErr = validatePrice(price);
    if (priceErr) return jsonError(400, priceErr.message);
    const id = generateId("prod");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id.slice(-6);
    await env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, price_cents, compare_at_price_cents, stock, status, image_url, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      name,
      slug,
      sanitizeString(body.description, 5e3) || null,
      Math.round(price * 100),
      body.compareAtPrice ? Math.round(Number(body.compareAtPrice) * 100) : null,
      Math.min(Math.max(0, Number(body.stock) || 0), 999999),
      body.status || "draft",
      sanitizeString(body.imageUrl, 500) || null,
      sanitizeString(body.seoTitle, 200) || null,
      sanitizeString(body.seoDescription, 300) || null
    ).run();
    if (body.variantOptions && Array.isArray(body.variantOptions)) {
      let cartesian = function(arrays) {
        if (arrays.length === 0) return [[]];
        const [first, ...rest] = arrays;
        const restCombos = cartesian(rest);
        return first.flatMap((v) => restCombos.map((combo) => [v, ...combo]));
      };
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
    return new Response(JSON.stringify({ id, slug }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return jsonError(400, err.message || "Failed to create product");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
