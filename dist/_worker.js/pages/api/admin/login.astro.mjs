globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as validateEmail, a as verifyPassword, b as generateId, d as getAdminSessionExpiry, e as createToken } from '../../../chunks/auth_CxCLYHmj.mjs';
import { r as rateLimitMiddleware } from '../../../chunks/rate-limit_D8m_UlCr.mjs';
import { j as jsonError, s as sanitizeString, a as jsonOk } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const POST = async ({ request, locals }) => {
  const rl = rateLimitMiddleware(request, { maxRequests: 5, windowMs: 6e4 });
  if (rl) return rl;
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const email = sanitizeString(body.email).toLowerCase().trim();
    const password = body.password || "";
    if (!email || !password) return jsonError(400, "Email and password required");
    if (!validateEmail(email)) return jsonError(400, "Invalid email format");
    const admin = await env.DB.prepare(
      "SELECT id, email, name, password_hash, role FROM admins WHERE email = ?"
    ).bind(email).first();
    if (!admin) return jsonError(401, "Invalid credentials");
    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) return jsonError(401, "Invalid credentials");
    const sessionId = generateId("sess");
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, admin.id, "admin", getAdminSessionExpiry()).run();
    const token = await createToken({ userId: admin.id, userType: "admin", sessionId }, 12);
    return jsonOk({ token, email: admin.email, name: admin.name });
  } catch {
    return jsonError(500, "An unexpected error occurred");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
