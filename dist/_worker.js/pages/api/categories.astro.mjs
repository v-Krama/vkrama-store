globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, a as categories } from '../../chunks/db_DGDNi2yE.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const GET = async ({ locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const db = getDb(env.DB);
  try {
    const result = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl
    }).from(categories).all();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" }
    });
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
