globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDb } from '../../../chunks/db_DcVNGvRk.mjs';
import { s as sql, f as productVariants, p as products, e as eq, d as desc } from '../../../chunks/schema_na8qKZKe.mjs';
import { g as getAuthUser, b as generateId } from '../../../chunks/auth_CxCLYHmj.mjs';
import { j as jsonError, s as sanitizeString } from '../../../chunks/validation_DU1POphA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const db = getDb(env.DB);
    const result = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      brand: products.brand,
      tags: products.tags,
      isFeatured: products.isFeatured,
      isPhysical: products.isPhysical,
      status: products.status,
      sortOrder: products.sortOrder,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      minPrice: sql`MIN(${productVariants.priceCents})`,
      maxPrice: sql`MAX(${productVariants.priceCents})`,
      variantCount: sql`COUNT(${productVariants.id})`,
      totalStock: sql`COALESCE(SUM(${productVariants.stock}), 0)`,
      defaultImage: sql`MIN(${productVariants.imageUrl})`
    }).from(products).leftJoin(productVariants, eq(products.id, productVariants.productId)).groupBy(products.id).orderBy(desc(products.createdAt)).all();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Products GET error:", err);
    return jsonError(500, "Failed to load products");
  }
};
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const body = await request.json().catch(() => null);
    if (!body) return jsonError(400, "Invalid request body");
    const b = body;
    const name = sanitizeString(b.name, 200);
    if (!name) return jsonError(400, "Product name is required");
    const id = generateId("prod");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + id.slice(-6);
    await env.DB.prepare(
      `INSERT INTO products (id, name, slug, description, brand, tags, is_featured, is_physical, status, sort_order, gtin, hs_code, origin_country, seo_title, seo_description, weight, weight_unit, min_order_qty, max_order_qty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      name,
      slug,
      sanitizeString(b.description, 5e3) || null,
      sanitizeString(b.brand, 100) || null,
      JSON.stringify(b.tags || []),
      b.isFeatured ? 1 : 0,
      b.isPhysical !== false ? 1 : 0,
      b.status || "draft",
      Math.max(0, Number(b.sortOrder) || 0),
      sanitizeString(b.gtin, 50) || null,
      sanitizeString(b.hsCode, 20) || null,
      sanitizeString(b.originCountry, 100) || null,
      sanitizeString(b.seoTitle, 200) || null,
      sanitizeString(b.seoDescription, 300) || null,
      b.weight ? Number(b.weight) : null,
      b.weightUnit || "kg",
      Math.max(1, Number(b.minOrderQty) || 1),
      b.maxOrderQty ? Math.max(1, Number(b.maxOrderQty)) : null
    ).run();
    const priceCents = b.priceCents || (b.price ? Math.round(Number(b.price) * 100) : 0);
    const stock = Math.min(Math.max(0, Number(b.stock) || 0), 999999);
    if (b.variants && Array.isArray(b.variants) && b.variants.length > 0) {
      for (const v of b.variants) {
        const variantId = generateId("var");
        await env.DB.prepare(
          `INSERT INTO product_variants (id, product_id, name, sku, barcode, price_cents, compare_at_price_cents, cost_cents, stock, weight, image_url, is_active, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          variantId,
          id,
          sanitizeString(v.name, 200) || "Default",
          sanitizeString(v.sku, 100) || null,
          sanitizeString(v.barcode, 100) || null,
          v.priceCents || priceCents,
          v.compareAtPriceCents || null,
          v.costCents || null,
          Math.min(Math.max(0, Number(v.stock) || stock), 999999),
          v.weight || null,
          sanitizeString(v.imageUrl, 500) || null,
          v.isActive !== false ? 1 : 0,
          Math.max(0, Number(v.sortOrder) || 0)
        ).run();
      }
    } else {
      const variantId = generateId("var");
      await env.DB.prepare(
        `INSERT INTO product_variants (id, product_id, name, sku, price_cents, compare_at_price_cents, cost_cents, stock, image_url, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        variantId,
        id,
        "Default",
        sanitizeString(b.sku, 100) || null,
        priceCents,
        b.compareAtPriceCents || null,
        b.costCents || null,
        stock,
        sanitizeString(b.imageUrl, 500) || null,
        1
      ).run();
    }
    if (b.variantOptions && Array.isArray(b.variantOptions)) {
      for (let i = 0; i < b.variantOptions.length; i++) {
        const opt = b.variantOptions[i];
        await env.DB.prepare(
          "INSERT INTO variant_options (product_id, group_name, value, sort_order) VALUES (?, ?, ?, ?)"
        ).bind(id, sanitizeString(opt.group, 50), sanitizeString(opt.value, 100), i).run();
      }
    }
    return new Response(JSON.stringify({ id, slug }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Product create error:", err);
    return jsonError(400, err.message || "Failed to create product");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
