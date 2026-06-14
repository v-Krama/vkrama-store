globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, o as orders, e as eq, f as orderItems } from '../../../chunks/db_BOPxdIeH.mjs';
import { j as jsonError, g as getAuthUser } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ params, request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(404, "Not found");
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  const db = getDb(env.DB);
  try {
    const order = await db.select().from(orders).where(eq(orders.id, params.id)).get();
    if (!order || order.customerId !== user.id) return jsonError(404, "Not found");
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).all();
    return new Response(JSON.stringify({ ...order, items }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return jsonError(404, "Not found");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
