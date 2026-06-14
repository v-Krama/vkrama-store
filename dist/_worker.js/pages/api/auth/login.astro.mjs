globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, c as customers, e as eq } from '../../../chunks/db_BOPxdIeH.mjs';
import { j as jsonError, s as sanitizeString, d as validateEmail, a as verifyPassword, c as generateId, l as getCustomerSessionExpiry, f as createToken, b as jsonOk } from '../../../chunks/validation_C3-TSEuz.mjs';
import { r as rateLimitMiddleware } from '../../../chunks/rate-limit_D8m_UlCr.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const POST = async ({ request, locals }) => {
  const rl = rateLimitMiddleware(request, { maxRequests: 5, windowMs: 6e4 });
  if (rl) return rl;
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const email = sanitizeString(body.email).toLowerCase();
    const password = body.password || "";
    if (!email || !password) return jsonError(400, "Email and password required");
    if (!validateEmail(email)) return jsonError(400, "Invalid email format");
    const db = getDb(env.DB);
    const customer = await db.select().from(customers).where(eq(customers.email, email)).get();
    if (!customer) return jsonError(401, "Invalid email or password");
    const valid = await verifyPassword(password, customer.passwordHash);
    if (!valid) return jsonError(401, "Invalid email or password");
    const sessionId = generateId("sess");
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, customer.id, "customer", getCustomerSessionExpiry()).run();
    const token = await createToken({ userId: customer.id, userType: "customer", sessionId }, 720);
    return jsonOk({ token, email: customer.email, name: customer.name, redirect: "/account/orders" });
  } catch {
    return jsonError(400, "Invalid request");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
