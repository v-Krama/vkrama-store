globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb } from '../../chunks/db_DcVNGvRk.mjs';
import { d as desc, p as products, Y as asc, f as productVariants, e as eq, Z as like, L as categories, K as productCategories, s as sql, u as and } from '../../chunks/schema_na8qKZKe.mjs';
import { C as CacheKeys, c as cacheGetOrSet } from '../../chunks/cache_BBIYjQGC.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const db = getDb(env.DB);
  const url = new URL(request.url);
  const categorySlug = url.searchParams.get("category");
  const search = url.searchParams.get("q");
  const sort = url.searchParams.get("sort") || "newest";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
  const featured = url.searchParams.get("featured");
  const cacheKey = CacheKeys.productList(JSON.stringify({ categorySlug, search, sort, limit, featured }));
  try {
    return new Response(
      await cacheGetOrSet(env.CACHE, cacheKey, async () => {
        let orderBy = desc(products.createdAt);
        if (sort === "price-asc") orderBy = asc(productVariants.priceCents);
        else if (sort === "price-desc") orderBy = desc(productVariants.priceCents);
        else if (sort === "name") orderBy = asc(products.name);
        const conditions = [eq(products.status, "active")];
        if (featured === "true") conditions.push(eq(products.isFeatured, true));
        if (search) conditions.push(like(products.name, `%${search}%`));
        let result;
        if (categorySlug) {
          const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).get();
          if (!cat) return "[]";
          conditions.push(eq(productCategories.categoryId, cat.id));
          result = await db.select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            description: products.description,
            brand: products.brand,
            tags: products.tags,
            isFeatured: products.isFeatured,
            status: products.status,
            createdAt: products.createdAt,
            variantId: productVariants.id,
            variantName: productVariants.name,
            priceCents: productVariants.priceCents,
            compareAtPriceCents: productVariants.compareAtPriceCents,
            stock: productVariants.stock,
            imageUrl: productVariants.imageUrl,
            sortOrder: productVariants.sortOrder,
            minPrice: sql`MIN(${productVariants.priceCents})`,
            maxPrice: sql`MAX(${productVariants.priceCents})`,
            variantCount: sql`COUNT(${productVariants.id})`,
            totalStock: sql`SUM(${productVariants.stock})`
          }).from(products).innerJoin(productCategories, eq(products.id, productCategories.productId)).innerJoin(productVariants, eq(products.id, productVariants.productId)).where(and(...conditions)).groupBy(products.id).orderBy(orderBy).limit(limit).all();
        } else {
          result = await db.select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            description: products.description,
            brand: products.brand,
            tags: products.tags,
            isFeatured: products.isFeatured,
            status: products.status,
            createdAt: products.createdAt,
            minPrice: sql`MIN(${productVariants.priceCents})`,
            maxPrice: sql`MAX(${productVariants.priceCents})`,
            variantCount: sql`COUNT(${productVariants.id})`,
            totalStock: sql`SUM(${productVariants.stock})`,
            imageUrl: sql`MIN(${productVariants.imageUrl})`
          }).from(products).innerJoin(productVariants, eq(products.id, productVariants.productId)).where(and(...conditions)).groupBy(products.id).orderBy(orderBy).limit(limit).all();
        }
        return JSON.stringify(result);
      }, 60),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60"
        }
      }
    );
  } catch (error) {
    console.error("Products API error:", error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
