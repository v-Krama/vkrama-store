globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb } from '../../chunks/db_DcVNGvRk.mjs';
import { s as sql, K as productCategories, L as categories } from '../../chunks/schema_na8qKZKe.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

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
      imageUrl: categories.imageUrl,
      productCount: sql`(SELECT COUNT(*) FROM ${productCategories} WHERE ${productCategories.categoryId} = ${categories.id})`
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
