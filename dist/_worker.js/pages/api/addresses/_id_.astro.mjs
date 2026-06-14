globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser } from '../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError, a as jsonOk, s as sanitizeString } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const DELETE = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(404, "Not found");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  const addr = await env.DB.prepare(
    "SELECT * FROM addresses WHERE id = ? AND customer_id = ?"
  ).bind(params.id, user.id).first();
  if (!addr) return jsonError(404, "Not found");
  await env.DB.prepare("DELETE FROM addresses WHERE id = ?").bind(params.id).run();
  return jsonOk({ ok: true });
};
const PUT = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(404, "Not found");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const isDefault = !!body.isDefault;
    if (isDefault) {
      await env.DB.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").bind(user.id).run();
    }
    await env.DB.prepare(
      "UPDATE addresses SET label = ?, name = ?, phone = ?, line1 = ?, line2 = ?, city = ?, state = ?, postal_code = ?, country = ?, is_default = ? WHERE id = ? AND customer_id = ?"
    ).bind(
      sanitizeString(body.label, 50) || "Home",
      sanitizeString(body.name, 100),
      sanitizeString(body.phone, 20) || null,
      sanitizeString(body.line1, 200),
      sanitizeString(body.line2, 200) || null,
      sanitizeString(body.city, 100),
      sanitizeString(body.state, 100),
      sanitizeString(body.postalCode, 20),
      sanitizeString(body.country, 2) || "NP",
      isDefault ? 1 : 0,
      params.id,
      user.id
    ).run();
    return jsonOk({ ok: true });
  } catch {
    return jsonError(400, "Failed to update address");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
