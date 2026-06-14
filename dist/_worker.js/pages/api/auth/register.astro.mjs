globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb } from '../../../chunks/db_DcVNGvRk.mjs';
import { I as customers, e as eq } from '../../../chunks/schema_na8qKZKe.mjs';
import { c as validateEmail, v as validatePassword, b as generateId, h as hashPassword, i as getCustomerSessionExpiry, e as createToken } from '../../../chunks/auth_CxCLYHmj.mjs';
import { r as rateLimitMiddleware } from '../../../chunks/rate-limit_D8m_UlCr.mjs';
import { j as jsonError, s as sanitizeString, a as jsonOk } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const POST = async ({ request, locals }) => {
  const rl = rateLimitMiddleware(request, { maxRequests: 3, windowMs: 6e4 });
  if (rl) return rl;
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const name = sanitizeString(body.name, 100);
    const email = sanitizeString(body.email).toLowerCase().trim();
    const password = body.password || "";
    if (!email || !password) return jsonError(400, "Name, email, and password required");
    if (!validateEmail(email)) return jsonError(400, "Invalid email format");
    const pwError = validatePassword(password);
    if (pwError) return jsonError(400, pwError);
    const db = getDb(env.DB);
    const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, email)).get();
    if (existing) return jsonError(409, "Email already registered");
    const customerId = generateId("cust");
    const passwordHash = await hashPassword(password);
    await env.DB.prepare(
      "INSERT INTO customers (id, email, name, password_hash) VALUES (?, ?, ?, ?)"
    ).bind(customerId, email, name || null, passwordHash).run();
    const sessionId = generateId("sess");
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, customerId, "customer", getCustomerSessionExpiry()).run();
    const token = await createToken({ userId: customerId, userType: "customer", sessionId }, 24);
    return jsonOk({ token, email, name, redirect: "/account/orders" });
  } catch {
    return jsonError(400, "Registration failed");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
