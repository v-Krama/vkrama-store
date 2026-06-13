globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken } from '../../../chunks/auth_rVfLOqBr.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const DELETE = async ({ params, request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "customer") return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const addr = await env.DB.prepare("SELECT * FROM addresses WHERE id = ? AND customer_id = ?").bind(params.id, payload.userId).first();
  if (!addr) return new Response("Not found", { status: 404 });
  await env.DB.prepare("DELETE FROM addresses WHERE id = ?").bind(params.id).run();
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
};
const PUT = async ({ params, request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "customer") return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  try {
    const { label, name, phone, line1, line2, city, state, postalCode, country, isDefault } = await request.json();
    if (isDefault) {
      await env.DB.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").bind(payload.userId).run();
    }
    await env.DB.prepare(
      "UPDATE addresses SET label = ?, name = ?, phone = ?, line1 = ?, line2 = ?, city = ?, state = ?, postal_code = ?, country = ?, is_default = ? WHERE id = ? AND customer_id = ?"
    ).bind(label || "Home", name, phone || null, line1, line2 || null, city, state, postalCode, country || "US", isDefault ? 1 : 0, params.id, payload.userId).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to update" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
