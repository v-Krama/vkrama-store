globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser } from '../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError, a as jsonOk } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  return jsonOk({ user, userType: user.userType });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
