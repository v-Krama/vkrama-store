globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as verifyPassword, g as generateId, b as getAdminSessionExpiry, c as createToken } from '../../../chunks/auth_B3dqqjmA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }
    const admin = await env.DB.prepare(
      "SELECT id, email, name, password_hash, role FROM admins WHERE email = ?"
    ).bind(email.toLowerCase().trim()).first();
    if (!admin) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }
    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }
    const sessionId = generateId("sess");
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, admin.id, "admin", getAdminSessionExpiry()).run();
    const token = await createToken({ userId: admin.id, userType: "admin", sessionId }, 12);
    return new Response(JSON.stringify({ token, email: admin.email, name: admin.name }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
