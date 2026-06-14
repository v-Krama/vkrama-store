globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, d as desc, p as products, j as asc, b as categories, e as eq, a as productCategories, l as like, k as and } from '../../chunks/db_BOPxdIeH.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const db = getDb(env.DB);
  const url = new URL(request.url);
  const categorySlug = url.searchParams.get("category");
  const search = url.searchParams.get("q");
  const sort = url.searchParams.get("sort") || "newest";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
  try {
    let orderBy = desc(products.createdAt);
    if (sort === "price-asc") orderBy = asc(products.priceCents);
    else if (sort === "price-desc") orderBy = desc(products.priceCents);
    else if (sort === "name") orderBy = asc(products.name);
    const selectFields = {
      id: products.id,
      name: products.name,
      slug: products.slug,
      priceCents: products.priceCents,
      compareAtPriceCents: products.compareAtPriceCents,
      stock: products.stock,
      imageUrl: products.imageUrl,
      status: products.status,
      description: products.description,
      createdAt: products.createdAt
    };
    if (categorySlug) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).get();
      if (cat) {
        const conditions2 = [eq(products.status, "active"), eq(productCategories.categoryId, cat.id)];
        if (search) conditions2.push(like(products.name, `%${search}%`));
        const result2 = await db.select(selectFields).from(products).innerJoin(productCategories, eq(products.id, productCategories.productId)).where(and(...conditions2)).orderBy(orderBy).limit(limit).all();
        return new Response(JSON.stringify(result2), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
        });
      }
    }
    const conditions = [eq(products.status, "active")];
    if (search) conditions.push(like(products.name, `%${search}%`));
    const result = await db.select(selectFields).from(products).where(and(...conditions)).orderBy(orderBy).limit(limit).all();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
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
