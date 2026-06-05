globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../../chunks/auth_B3dqqjmA.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

async function checkAdmin(request) {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const payload = await verifyToken(auth.slice(7));
  return !!payload && payload.userType === "admin";
}
const GET = async ({ params, request, locals }) => {
  if (!await checkAdmin(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const row = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(params.id).first();
  if (!row) return new Response("Not found", { status: 404 });
  const variants = await env.DB.prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order").bind(params.id).all();
  const opts = await env.DB.prepare("SELECT * FROM variant_options WHERE product_id = ? ORDER BY sort_order").bind(params.id).all();
  return new Response(JSON.stringify({ ...row, variants: variants.results, variantOptions: opts.results }), {
    headers: { "Content-Type": "application/json" }
  });
};
const PUT = async ({ params, request, locals }) => {
  if (!await checkAdmin(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  try {
    const body = await request.json();
    await env.DB.prepare(
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
      params.id
    ).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Update failed" }), { status: 400 });
  }
};
const DELETE = async ({ params, request, locals }) => {
  if (!await checkAdmin(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  try {
    await env.DB.prepare("DELETE FROM product_variants WHERE product_id = ?").bind(params.id).run();
    await env.DB.prepare("DELETE FROM variant_options WHERE product_id = ?").bind(params.id).run();
    await env.DB.prepare("DELETE FROM product_categories WHERE product_id = ?").bind(params.id).run();
    await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(params.id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Delete failed" }), { status: 400 });
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
