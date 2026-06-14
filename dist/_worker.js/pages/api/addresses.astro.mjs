globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser, j as jsonError, s as sanitizeString, c as generateId, b as jsonOk } from '../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  const result = await env.DB.prepare(
    "SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC"
  ).bind(user.id).all();
  return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json" } });
};
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const name = sanitizeString(body.name, 100);
    const line1 = sanitizeString(body.line1, 200);
    const city = sanitizeString(body.city, 100);
    const state = sanitizeString(body.state, 100);
    const postalCode = sanitizeString(body.postalCode, 20);
    const country = sanitizeString(body.country, 2) || "NP";
    if (!name || !line1 || !city || !state || !postalCode) {
      return jsonError(400, "Name, address line 1, city, state, and postal code are required");
    }
    const isDefault = !!body.isDefault;
    const id = generateId("addr");
    if (isDefault) {
      await env.DB.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").bind(user.id).run();
    }
    await env.DB.prepare(
      "INSERT INTO addresses (id, customer_id, label, name, phone, line1, line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id,
      user.id,
      sanitizeString(body.label, 50) || "Home",
      name,
      sanitizeString(body.phone, 20) || null,
      line1,
      sanitizeString(body.line2, 200) || null,
      city,
      state,
      postalCode,
      country,
      isDefault ? 1 : 0
    ).run();
    return jsonOk({ id });
  } catch {
    return jsonError(400, "Failed to create address");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
