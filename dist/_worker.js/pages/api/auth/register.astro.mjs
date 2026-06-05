globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, c as customers, e as eq } from '../../../chunks/db_BrnEeMLF.mjs';
import { g as generateId, h as hashPassword, d as getCustomerSessionExpiry, c as createToken } from '../../../chunks/auth_DQG_9vYb.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const db = getDb(env.DB);
  try {
    const { name, email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Name, email, and password required" }), { status: 400 });
    }
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400 });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, normalizedEmail)).get();
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });
    }
    const customerId = generateId("cust");
    const passwordHash = await hashPassword(password);
    await env.DB.prepare(
      "INSERT INTO customers (id, email, name, password_hash) VALUES (?, ?, ?, ?)"
    ).bind(customerId, normalizedEmail, name || null, passwordHash).run();
    const sessionId = generateId("sess");
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, customerId, "customer", getCustomerSessionExpiry()).run();
    const token = await createToken({ userId: customerId, userType: "customer", sessionId }, 720);
    return new Response(JSON.stringify({ token, email: normalizedEmail, name: name || "", redirect: "/account/orders" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Registration failed" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
