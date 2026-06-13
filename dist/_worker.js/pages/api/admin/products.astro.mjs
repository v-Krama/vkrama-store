globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, d as desc } from '../../../chunks/db_DGDNi2yE.mjs';
import { c as checkAdminAuth, g as generateId } from '../../../chunks/auth_B-iE9LmZ.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const GET = async ({ request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  try {
    const db = getDb(env.DB);
    const result = await db.select().from(products).orderBy(desc(products.createdAt)).all();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Products GET error:", err);
    return new Response(JSON.stringify({ error: "Failed to load products" }), { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  try {
    const body = await request.json();
    const id = generateId("prod");
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id.slice(-6);
    await env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, price_cents, compare_at_price_cents, stock, status, image_url, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      body.name,
      slug,
      body.description || null,
      Math.round(body.price * 100),
      body.compareAtPrice ? Math.round(body.compareAtPrice * 100) : null,
      body.stock || 0,
      body.status || "draft",
      body.imageUrl || null,
      body.seoTitle || null,
      body.seoDescription || null
    ).run();
    if (body.variantOptions && body.variantOptions.length > 0) {
      let cartesian = function(arrays) {
        if (arrays.length === 0) return [[]];
        const [first, ...rest] = arrays;
        const restCombos = cartesian(rest);
        return first.flatMap((v) => restCombos.map((combo) => [v, ...combo]));
      };
      for (const opt of body.variantOptions) {
        await env.DB.prepare(
          "INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)"
        ).bind(id, opt.group, opt.value, 0).run();
      }
      const groups = [...new Set(body.variantOptions.map((o) => o.group))];
      const valuesByGroup = groups.map((g) => body.variantOptions.filter((o) => o.group === g).map((o) => o.value));
      const combinations = cartesian(valuesByGroup);
      for (const combo of combinations) {
        const variantName = combo.join(" / ");
        const variantId = generateId("var");
        await env.DB.prepare(
          "INSERT INTO product_variants (id, product_id, name, stock, price_cents) VALUES (?, ?, ?, ?, ?)"
        ).bind(variantId, id, variantName, body.stock || 0, body.price ? Math.round(body.price * 100) : null).run();
      }
    }
    return new Response(JSON.stringify({ id, slug }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to create product" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
