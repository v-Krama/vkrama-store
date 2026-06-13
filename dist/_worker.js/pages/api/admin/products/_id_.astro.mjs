globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkAdminAuth } from '../../../../chunks/auth_C4GgaQbx.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const GET = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "Product ID required" }), { status: 400 });
  try {
    const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!product) return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    return new Response(JSON.stringify(product), { headers: { "Content-Type": "application/json" } });
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
      id
    ).run();
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
