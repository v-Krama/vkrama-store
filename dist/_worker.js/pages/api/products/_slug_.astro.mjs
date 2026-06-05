globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, e as eq, f as productVariants, h as asc, v as variantOptions, a as categories, j as productCategories } from '../../../chunks/db_FAPdo79f.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const GET = async ({ params, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const db = getDb(env.DB);
  try {
    const product = await db.select().from(products).where(eq(products.slug, params.slug)).get();
    if (!product || product.status !== "active") {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id)).orderBy(asc(productVariants.sortOrder)).all();
    const opts = await db.select().from(variantOptions).where(eq(variantOptions.productId, product.id)).orderBy(asc(variantOptions.sortOrder)).all();
    const cats = await db.select({ name: categories.name, slug: categories.slug }).from(categories).innerJoin(productCategories, eq(categories.id, productCategories.categoryId)).where(eq(productCategories.productId, product.id)).all();
    return new Response(JSON.stringify({ ...product, variants, variantOptions: opts, categories: cats }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
    });
  } catch (err) {
    console.error("Product detail error:", err);
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
