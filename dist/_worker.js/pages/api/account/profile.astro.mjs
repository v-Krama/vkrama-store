globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsonError, g as getAuthUser, b as jsonOk, s as sanitizeString } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  const row = await env.DB.prepare(
    "SELECT id, email, name, phone FROM customers WHERE id = ?"
  ).bind(user.id).first();
  return jsonOk({ user: row });
};
const PUT = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const name = sanitizeString(body.name, 100);
    const phone = sanitizeString(body.phone, 20) || null;
    await env.DB.prepare("UPDATE customers SET name = ?, phone = ? WHERE id = ?").bind(name, phone, user.id).run();
    return jsonOk({ ok: true });
  } catch {
    return jsonError(400, "Update failed");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
