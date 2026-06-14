globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, p as products, e as eq, b as categories, a as productCategories, h as productVariants, v as variantOptions } from '../../../chunks/db_BOPxdIeH.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ params, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const db = getDb(env.DB);
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });
  try {
    const product = await db.select().from(products).where(eq(products.slug, slug)).get();
    if (!product || product.status !== "active") {
      return new Response("Not found", { status: 404 });
    }
    const cats = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug
    }).from(categories).innerJoin(productCategories, eq(categories.id, productCategories.categoryId)).where(eq(productCategories.productId, product.id)).all();
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id)).orderBy(productVariants.sortOrder).all();
    const vOptions = await db.select().from(variantOptions).where(eq(variantOptions.productId, product.id)).orderBy(variantOptions.sortOrder).all();
    return new Response(JSON.stringify({ ...product, categories: cats, variants, variantOptions: vOptions }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
