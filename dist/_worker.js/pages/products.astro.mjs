globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DUQEdt6X.mjs';
import { $ as $$Base } from '../chunks/Base_LuIWtNvf.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_BsYlTPCN.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const $$Astro = createAstro("https://vkrama.com.np");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const category = Astro2.url.searchParams.get("category");
  const search = Astro2.url.searchParams.get("q");
  const sort = Astro2.url.searchParams.get("sort") || "newest";
  parseInt(Astro2.url.searchParams.get("page") || "1");
  const view = Astro2.url.searchParams.get("view") || "grid";
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
  const buildUrl = (params) => {
    const p = new URLSearchParams();
    if (params.category ?? category) p.set("category", params.category ?? category);
    if (params.q ?? search) p.set("q", params.q ?? search);
    p.set("sort", params.sort ?? sort);
    if (params.view ?? view) p.set("view", params.view ?? view);
    if (params.page) p.set("page", params.page);
    const s = p.toString();
    return `/products${s ? "?" + s : ""}`;
  };
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": formattedTitle, "description": `Browse ${pageTitle.toLowerCase()} at vkrama. Quality products at great prices.` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-12 md:py-16"> <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div> <div class="absolute top-10 right-10 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl"></div> <div class="container-page relative"> <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> <div> <nav class="flex items-center gap-2 text-sm text-brand-200/60 mb-3"> <a href="/" class="hover:text-white transition-colors">Home</a> <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> <span class="text-white/80">${pageTitle}</span> </nav> <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">${pageTitle}</h1> <p class="text-brand-200/70 mt-2"> ${hasProducts ? products.length : 0} product${products.length !== 1 ? "s" : ""} ${search && ` found for "${search}"`} </p> </div> ${search && renderTemplate`<a href="/products" class="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 shrink-0 self-start">
Clear Search
</a>`} </div> </div> </section>  <div class="container-page py-8 lg:py-10"> <div class="flex flex-col lg:flex-row gap-8"> <!-- Filters Sidebar --> <aside class="w-full lg:w-60 shrink-0"> <div class="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-hide"> <!-- Mobile filter toggle --> <div class="flex items-center justify-between lg:hidden mb-4"> <button id="filter-toggle" class="btn-secondary btn-sm"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
Filters
</button> <span class="text-sm text-surface-500">${hasProducts ? products.length : 0} products</span> </div> <div id="filters-content" class="hidden lg:block space-y-6"> <!-- Categories --> <div> <h3 class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Categories</h3> <div class="space-y-1"> <a href="/products"${addAttribute(`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${!category ? "bg-brand-50 text-brand-700 font-semibold" : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"}`, "class")}> <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
All Products
</a> ${hasCategories && categories.map((cat) => renderTemplate`<a${addAttribute(`/products?category=${cat.slug}`, "href")}${addAttribute(`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${category === cat.slug ? "bg-brand-50 text-brand-700 font-semibold" : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"}`, "class")}> <div class="w-1.5 h-1.5 rounded-full bg-current shrink-0"></div> ${cat.name} </a>`)} </div> </div> <!-- Sort --> <div> <h3 class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Sort By</h3> <select class="select text-sm"${addAttribute(`window.location.href = '/products?sort=' + this.value + '&category=' + (new URLSearchParams(window.location.search).get('category') || '') + '&q=' + (new URLSearchParams(window.location.search).get('q') || '') + '&view=' + (new URLSearchParams(window.location.search).get('view') || 'grid')`, "onChange")}> <option value="newest"${addAttribute(sort === "newest", "selected")}>Newest</option> <option value="price-asc"${addAttribute(sort === "price-asc", "selected")}>Price: Low to High</option> <option value="price-desc"${addAttribute(sort === "price-desc", "selected")}>Price: High to Low</option> <option value="name"${addAttribute(sort === "name", "selected")}>Name: A-Z</option> </select> </div> </div> </div> </aside> <!-- Product Grid/List --> <div class="flex-1 min-w-0"> <!-- Active filters & view toggle --> <div class="flex items-center justify-between gap-4 mb-6"> <div class="flex items-center gap-2 flex-wrap"> ${category && renderTemplate`<a href="/products" class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-medium border border-brand-200 hover:bg-brand-100 transition-colors group"> ${categories.find((c) => c.slug === category)?.name || category} <svg class="w-3 h-3 text-brand-400 group-hover:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> </a>`} </div> <div class="flex items-center gap-1.5 bg-surface-100 rounded-lg p-1"> <button${addAttribute(`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-white shadow-sm text-surface-900" : "text-surface-400 hover:text-surface-600"}`, "class")}${addAttribute(`window.location.href = '${buildUrl({ view: "grid" })}'`, "onclick")} aria-label="Grid view"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> </button> <button${addAttribute(`p-1.5 rounded-md transition-all ${view === "list" ? "bg-white shadow-sm text-surface-900" : "text-surface-400 hover:text-surface-600"}`, "class")}${addAttribute(`window.location.href = '${buildUrl({ view: "list" })}'`, "onclick")} aria-label="List view"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg> </button> </div> </div> ${hasProducts ? view === "list" ? renderTemplate`<div class="space-y-4"> ${products.map((p) => renderTemplate`<a${addAttribute(`/products/${p.slug}`, "href")} class="group flex gap-4 sm:gap-6 p-4 rounded-2xl bg-white border border-surface-200 hover:border-surface-300 hover:shadow-lg transition-all duration-300"> <div class="w-24 h-24 sm:w-28 sm:h-28 bg-surface-100 rounded-xl overflow-hidden shrink-0"> ${p.imageUrl ? renderTemplate`<img${addAttribute(p.imageUrl, "src")}${addAttribute(p.name, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" loading="lazy">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-surface-300"> <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> </div>`} </div> <div class="flex-1 min-w-0 flex flex-col justify-center"> <h3 class="font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">${p.name}</h3> <p class="text-sm text-surface-500 mt-0.5 line-clamp-1">${p.description || ""}</p> <div class="flex items-center gap-3 mt-2"> <span class="text-lg font-bold text-surface-900">Rs. ${(p.priceCents / 100).toFixed(2)}</span> ${p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents && renderTemplate`<span class="text-sm text-surface-400 line-through">Rs. ${(p.compareAtPriceCents / 100).toFixed(2)}</span>`} ${p.status !== "active" && renderTemplate`<span class="badge-red text-2xs">Out of Stock</span>`} </div> </div> <div class="hidden sm:flex items-center"> <span class="btn-ghost btn-sm text-brand-600 group-hover:bg-brand-50"> <span class="hidden md:inline">View</span> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> </span> </div> </a>`)} </div>` : renderTemplate`<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"> ${products.map((p, i) => renderTemplate`<div class="animate-fade-in-up"${addAttribute(`animation-delay: ${i % 8 * 0.05}s`, "style")}> ${renderComponent($$result2, "ProductCard", $$ProductCard, { "slug": p.slug, "name": p.name, "priceCents": p.priceCents, "compareAtPriceCents": p.compareAtPriceCents, "imageUrl": p.imageUrl, "status": p.status })} </div>`)} </div>` : renderTemplate`<div class="text-center py-20"> <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface-100 flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path> </svg> </div> <p class="text-surface-900 text-lg font-semibold">No products found</p> <p class="text-surface-500 text-sm mt-1 max-w-xs mx-auto"> ${search ? `No results for "${search}". Try different keywords.` : "Try adjusting your filters or browse all products."} </p> <div class="flex flex-wrap justify-center gap-3 mt-6"> <a href="/products" class="btn-primary">Clear Filters</a> ${search && renderTemplate`<a href="/products" class="btn-secondary">Browse All</a>`} </div> </div>`} </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/products/index.astro?astro&type=script&index=0&lang.ts")}`;
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
