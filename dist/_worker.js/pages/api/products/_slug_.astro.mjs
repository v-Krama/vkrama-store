globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb } from '../../../chunks/db_DcVNGvRk.mjs';
import { p as products, e as eq, L as categories, K as productCategories, f as productVariants, R as variantOptions, U as variantOptionLinks, X as reviews, d as desc } from '../../../chunks/schema_na8qKZKe.mjs';
import { c as cacheGetOrSet, C as CacheKeys } from '../../../chunks/cache_BBIYjQGC.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ params, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response("Not found", { status: 404 });
  const db = getDb(env.DB);
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });
  try {
    const data = await cacheGetOrSet(env.CACHE, CacheKeys.product(slug), async () => {
      const product = await db.select().from(products).where(eq(products.slug, slug)).get();
      if (!product || product.status !== "active") return null;
      const cats = await db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).innerJoin(productCategories, eq(categories.id, productCategories.categoryId)).where(eq(productCategories.productId, product.id)).all();
      const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id)).orderBy(productVariants.sortOrder).all();
      const vOptions = await db.select().from(variantOptions).where(eq(variantOptions.productId, product.id)).orderBy(variantOptions.sortOrder).all();
      const vOptionLinks = await db.select().from(variantOptionLinks).innerJoin(variantOptions, eq(variantOptionLinks.optionId, variantOptions.id)).where(eq(variantOptions.productId, product.id)).all();
      const productReviews = await db.select().from(reviews).where(eq(reviews.productId, product.id)).orderBy(desc(reviews.createdAt)).all();
      const avgRating = productReviews.length ? Math.round(productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length * 10) / 10 : null;
      return JSON.stringify({
        ...product,
        categories: cats,
        variants,
        variantOptions: vOptions,
        variantOptionLinks: vOptionLinks,
        reviews: productReviews,
        avgRating,
        reviewCount: productReviews.length
      });
    }, 120);
    if (!data) return new Response("Not found", { status: 404 });
    return new Response(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
      }
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
