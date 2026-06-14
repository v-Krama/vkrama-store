globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb } from '../../chunks/db_DcVNGvRk.mjs';
import { N as orders, e as eq, d as desc } from '../../chunks/schema_na8qKZKe.mjs';
import { g as getAuthUser } from '../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError } from '../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "customer");
  if (!user) return jsonError(401, "Unauthorized");
  const db = getDb(env.DB);
  try {
    const result = await db.select().from(orders).where(eq(orders.customerId, user.id)).orderBy(desc(orders.createdAt)).all();
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
