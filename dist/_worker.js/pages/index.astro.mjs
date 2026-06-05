globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Base } from '../chunks/Base_BrzleQZO.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_C-qYKpSJ.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Astro = createAstro("https://vkrama.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const products = await (async () => {
    try {
      const res = await fetch(`${Astro2.url.origin}/api/products?limit=8`);
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
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Home", "description": "Shop at vkrama \u2014 premium products curated for quality. Free shipping on orders over Rs. 5,000." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900"> <div class="absolute inset-0 opacity-10"> <div class="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-3xl"></div> <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-300 rounded-full blur-3xl"></div> </div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"> <div class="max-w-2xl"> <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80 ring-1 ring-white/20 mb-6"> <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
Free shipping on orders over Rs. 5,000
</span> <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
Discover Quality <br class="hidden sm:block"> <span class="text-brand-200">Premium Products</span> </h1> <p class="mt-4 text-lg md:text-xl text-brand-100 leading-relaxed max-w-xl">
Curated collection of premium products. Quality you can trust, prices you'll love.
</p> <div class="flex flex-wrap gap-4 mt-8"> <a href="/products" class="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
Shop Now
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> <a href="/products?category=electronics" class="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all ring-1 ring-white/20">
Browse Categories
</a> </div> </div> </div> </section>  ${hasCategories && renderTemplate`<section class="container-page section-padding"> <div class="text-center mb-10"> <h2 class="text-2xl md:text-3xl font-bold text-surface-900">Shop by Category</h2> <p class="mt-2 text-surface-500">Find exactly what you're looking for</p> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/products?category=${cat.slug}`, "href")} class="group relative overflow-hidden rounded-2xl bg-surface-100 border border-surface-200 hover:border-brand-300 transition-all hover:shadow-lg"> <div class="p-8"> <h3 class="text-xl font-bold text-surface-900 group-hover:text-brand-600 transition-colors"> ${cat.name} </h3> ${cat.description && renderTemplate`<p class="mt-1 text-sm text-surface-500">${cat.description}</p>`} <span class="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
Shop Now
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </span> </div> </a>`)} </div> </section>`} <section class="bg-white section-padding"> <div class="container-page"> <div class="flex items-center justify-between mb-8"> <div> <h2 class="text-2xl md:text-3xl font-bold text-surface-900">Featured Products</h2> <p class="mt-1 text-surface-500">Our most popular picks</p> </div> <a href="/products" class="btn-secondary">
View All &rarr;
</a> </div> ${hasProducts ? renderTemplate`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"> ${products.map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "slug": p.slug, "name": p.name, "priceCents": p.priceCents, "compareAtPriceCents": p.compareAtPriceCents, "imageUrl": p.imageUrl, "status": p.status })}`)} </div>` : renderTemplate`<div class="text-center py-16 text-surface-400"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path> </svg> <p>No products yet. Check back soon!</p> </div>`} </div> </section>  <section class="container-page section-padding"> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="text-center p-6"> <div class="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path> </svg> </div> <h3 class="font-semibold text-surface-900">Free Shipping</h3> <p class="mt-1 text-sm text-surface-500">On all orders over Rs. 5,000</p> </div> <div class="text-center p-6"> <div class="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="font-semibold text-surface-900">Secure Checkout</h3> <p class="mt-1 text-sm text-surface-500">Powered by Stripe</p> </div> <div class="text-center p-6"> <div class="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path> </svg> </div> <h3 class="font-semibold text-surface-900">Easy Returns</h3> <p class="mt-1 text-sm text-surface-500">30-day return policy</p> </div> <div class="text-center p-6"> <div class="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="font-semibold text-surface-900">24/7 Support</h3> <p class="mt-1 text-sm text-surface-500">We're here to help</p> </div> </div> </section>  <section class="bg-gradient-to-r from-brand-600 to-brand-800"> <div class="container-page py-16 text-center"> <h2 class="text-2xl md:text-3xl font-bold text-white">Ready to start shopping?</h2> <p class="mt-2 text-brand-100">Browse our collection and find something you love.</p> <a href="/products" class="inline-flex items-center gap-2 mt-6 bg-white text-brand-700 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-all shadow-lg">
Browse Products
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> </div> </section> ` })}`;
}, "/home/v-krama/vkrama-store/src/pages/index.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
