globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb, d as desc, p as products, h as asc, e as eq, l as like, a as categories, j as productCategories, k as and } from '../../chunks/db_DGDNi2yE.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';

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
    const conditions = [eq(products.status, "active")];
    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }
    if (categorySlug) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).get();
      if (cat) {
        const result2 = await db.select({
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
        }).from(products).innerJoin(productCategories, eq(products.id, productCategories.productId)).where(and(eq(products.status, "active"), eq(productCategories.categoryId, cat.id), ...search ? [like(products.name, `%${search}%`)] : [])).orderBy(orderBy).limit(limit).all();
        return new Response(JSON.stringify(result2), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
        });
      }
    }
    const result = await db.select({
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
    }).from(products).where(and(...conditions)).orderBy(orderBy).limit(limit).all();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
    });
  } catch (err) {
    console.error("Products API error:", err);
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
