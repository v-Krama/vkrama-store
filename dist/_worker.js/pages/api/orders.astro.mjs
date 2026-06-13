globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, o as orders, e as eq, d as desc } from '../../chunks/db_DGDNi2yE.mjs';
import { v as verifyToken } from '../../chunks/auth_C4GgaQbx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const db = getDb(env.DB);
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "customer") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const result = await db.select().from(orders).where(eq(orders.customerId, payload.userId)).orderBy(desc(orders.createdAt)).all();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
