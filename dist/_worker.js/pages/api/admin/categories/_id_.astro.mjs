globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkAdminAuth } from '../../../../chunks/auth_B-iE9LmZ.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const DELETE = async ({ params, request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  await env.DB.prepare("DELETE FROM product_categories WHERE category_id = ?").bind(params.id).run();
  await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(params.id).run();
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
