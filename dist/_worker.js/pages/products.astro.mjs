globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Ce7Lw4RO.mjs';
import { $ as $$Base } from '../chunks/Base_COq19l6H.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_DAvHK8Fh.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_CzUJxHa9.mjs';

const $$Astro = createAstro("https://vkrama.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const category = Astro2.url.searchParams.get("category");
  const search = Astro2.url.searchParams.get("q");
  const sort = Astro2.url.searchParams.get("sort") || "newest";
  const products = await (async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("q", search);
      if (sort) params.set("sort", sort);
      params.set("limit", "50");
      const res = await fetch(`${Astro2.url.origin}/api/products?${params}`);
      if (res.ok) return await res.json();
    } catch {
    }
    return [];
  })();
  const categories = await (async () => {
    try {
      const res = await fetch(`${Astro2.url.origin}/api/categories`);
      if (res.ok) return await res.json();
    } catch {
    }
    return [];
  })();
  const hasProducts = Array.isArray(products) && products.length > 0;
  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const pageTitle = category ? categories.find((c) => c.slug === category)?.name || `Category: ${category}` : search ? `Search: "${search}"` : "All Products";
  const formattedTitle = search ? `Search results for "${search}"` : pageTitle;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": formattedTitle, "description": `Browse ${pageTitle.toLowerCase()} at vkrama. Quality products at great prices.` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="flex flex-col lg:flex-row gap-8"> <!-- Filters Sidebar --> <aside class="w-full lg:w-56 shrink-0"> <div class="lg:sticky lg:top-24"> <div class="flex items-center justify-between lg:block mb-4"> <h2 class="font-semibold text-surface-900">Categories</h2> <button id="filter-toggle" class="lg:hidden text-sm text-brand-600 font-medium">Show Filters</button> </div> <div id="filters-content" class="hidden lg:block space-y-1"> <a href="/products"${addAttribute(`block px-3 py-2 rounded-lg text-sm transition-colors ${!category ? "bg-brand-50 text-brand-700 font-semibold" : "text-surface-600 hover:bg-surface-100"}`, "class")}>
All Products
</a> ${hasCategories && categories.map((cat) => renderTemplate`<a${addAttribute(`/products?category=${cat.slug}`, "href")}${addAttribute(`block px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.slug ? "bg-brand-50 text-brand-700 font-semibold" : "text-surface-600 hover:bg-surface-100"}`, "class")}> ${cat.name} </a>`)} </div> </div> </aside> <!-- Product Grid --> <div class="flex-1"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"> <div> <h1 class="text-2xl font-bold text-surface-900">${pageTitle}</h1> <p class="text-sm text-surface-500 mt-1"> ${hasProducts ? products.length : 0} product${products.length !== 1 ? "s" : ""} ${search && ` for "${search}"`} </p> </div> <div class="flex items-center gap-3"> <label class="text-sm text-surface-500">Sort:</label> <select class="input w-auto py-1.5 text-sm" onChange="window.location.href = '/products?sort=' + this.value + '&category=' + (new URLSearchParams(window.location.search).get('category') || '') + '&q=' + (new URLSearchParams(window.location.search).get('q') || '')"> <option value="newest"${addAttribute(sort === "newest", "selected")}>Newest</option> <option value="price-asc"${addAttribute(sort === "price-asc", "selected")}>Price: Low to High</option> <option value="price-desc"${addAttribute(sort === "price-desc", "selected")}>Price: High to Low</option> <option value="name"${addAttribute(sort === "name", "selected")}>Name: A-Z</option> </select> </div> </div> ${hasProducts ? renderTemplate`<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"> ${products.map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "slug": p.slug, "name": p.name, "priceCents": p.priceCents, "compareAtPriceCents": p.compareAtPriceCents, "imageUrl": p.imageUrl, "status": p.status })}`)} </div>` : renderTemplate`<div class="text-center py-20"> <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path> </svg> <p class="text-surface-500 text-lg font-medium">No products found</p> <p class="text-surface-400 text-sm mt-1">Try adjusting your filters or search terms</p> <a href="/products" class="btn-primary mt-6">Clear Filters</a> </div>`} </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/products/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/products/index.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/products/index.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
