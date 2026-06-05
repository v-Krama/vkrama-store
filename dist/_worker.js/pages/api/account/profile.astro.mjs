globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../chunks/auth_DQG_9vYb.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const GET = async ({ request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "customer") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ user: null }), { status: 200 });
  const row = await env.DB.prepare("SELECT id, email, name, phone FROM customers WHERE id = ?").bind(payload.userId).first();
  return new Response(JSON.stringify({ user: row }), {
    headers: { "Content-Type": "application/json" }
  });
};
const PUT = async ({ request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "customer") return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  try {
    const { name, phone } = await request.json();
    await env.DB.prepare("UPDATE customers SET name = ?, phone = ? WHERE id = ?").bind(name || null, phone || null, payload.userId).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Update failed" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
