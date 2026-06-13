globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../chunks/auth_B-iE9LmZ.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const GET = async ({ request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const payload = await verifyToken(auth.slice(7));
  if (!payload) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const env = locals.runtime?.env;
  let user = null;
  if (payload.userType === "customer" && env?.DB) {
    const row = await env.DB.prepare("SELECT id, email, name FROM customers WHERE id = ?").bind(payload.userId).first();
    if (row) user = row;
  }
  return new Response(JSON.stringify({ user, userType: payload.userType }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
