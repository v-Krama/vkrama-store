globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, c as customers, e as eq } from '../../../chunks/db_DGDNi2yE.mjs';
import { a as verifyPassword, g as generateId, e as getCustomerSessionExpiry, d as createToken } from '../../../chunks/auth_C4GgaQbx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  const db = getDb(env.DB);
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }
    const customer = await db.select().from(customers).where(eq(customers.email, email.toLowerCase())).get();
    if (!customer) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }
    const valid = await verifyPassword(password, customer.passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }
    const sessionId = generateId("sess");
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, user_type, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(sessionId, customer.id, "customer", getCustomerSessionExpiry()).run();
    const token = await createToken({ userId: customer.id, userType: "customer", sessionId }, 720);
    return new Response(JSON.stringify({ token, email: customer.email, name: customer.name, redirect: "/account/orders" }), {
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
