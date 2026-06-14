globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser } from '../../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError, a as jsonOk } from '../../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const DELETE = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(404, "Not found");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  await env.DB.prepare("DELETE FROM product_categories WHERE category_id = ?").bind(params.id).run();
  await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(params.id).run();
  return jsonOk({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
