globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../../chunks/auth_B3dqqjmA.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const DELETE = async ({ params, request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "admin") return new Response("Unauthorized", { status: 401 });
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
