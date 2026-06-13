globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, q as Fragment } from '../chunks/astro/server_Ce7Lw4RO.mjs';
import { $ as $$Base } from '../chunks/Base_UPGipB-W.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_DAvHK8Fh.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_CzUJxHa9.mjs';

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
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Home", "description": "Shop at vkrama \u2014 premium products curated for quality. Free shipping on orders over Rs. 5,000." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 min-h-[85vh] flex items-center"> <div class="absolute inset-0"> <div class="absolute top-20 left-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl animate-pulse"></div> <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-300/5 rounded-full blur-3xl"></div> </div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full"> <div class="max-w-3xl mx-auto text-center"> <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 ring-1 ring-white/20 mb-8 backdrop-blur-sm"> <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
Free shipping on orders over Rs. 5,000
</div> <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
Discover Quality
<br class="hidden sm:block"> <span class="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">Premium Products</span> </h1> <p class="mt-6 text-lg md:text-xl text-brand-200 leading-relaxed max-w-2xl mx-auto">
Curated collection of premium products. Quality you can trust, prices you'll love.
          Shop with confidence and enjoy free shipping across Nepal.
</p> <div class="flex flex-wrap justify-center gap-4 mt-10"> <a href="/products" class="inline-flex items-center gap-2 bg-accent-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-accent-600 transition-all shadow-lg hover:shadow-xl hover:shadow-accent-500/25 active:scale-[0.98] text-base">
Shop Now
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> <a href="/products?category=electronics" class="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/20 transition-all ring-1 ring-white/20 backdrop-blur-sm text-base">
Browse Categories
</a> </div> <div class="mt-16 flex items-center justify-center gap-8 text-white/40 text-sm"> <span class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Secure Checkout
</span> <span class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path> </svg>
Easy Returns
</span> <span class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
24/7 Support
</span> </div> </div> </div> </section>  ${hasCategories && renderTemplate`<section class="container-page section-padding"> <div class="text-center mb-12"> <span class="badge-blue mb-4 inline-block">Categories</span> <h2 class="text-2xl md:text-3xl font-bold text-surface-900">Shop by Category</h2> <p class="mt-2 text-surface-500 max-w-md mx-auto">Find exactly what you're looking for from our curated collection</p> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/products?category=${cat.slug}`, "href")} class="group relative overflow-hidden rounded-2xl bg-white border border-surface-200 hover:border-brand-300 transition-all hover:shadow-xl hover:-translate-y-0.5"> ${cat.imageUrl ? renderTemplate`<div class="aspect-[16/9] overflow-hidden"> <img${addAttribute(cat.imageUrl, "src")}${addAttribute(cat.name, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"> </div>` : renderTemplate`<div class="aspect-[16/9] bg-gradient-to-br from-brand-50 to-surface-100 flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div>`} <div class="p-6"> <h3 class="text-xl font-bold text-surface-900 group-hover:text-brand-600 transition-colors"> ${cat.name} </h3> ${cat.description && renderTemplate`<p class="mt-1.5 text-sm text-surface-500 leading-relaxed">${cat.description}</p>`} <span class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-brand-600 group-hover:gap-3 transition-all">
Shop Now
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </span> </div> </a>`)} </div> </section>`} <section class="bg-white section-padding"> <div class="container-page"> <div class="text-center mb-12"> <span class="badge-purple mb-4 inline-block">Featured</span> <h2 class="text-2xl md:text-3xl font-bold text-surface-900">Featured Products</h2> <p class="mt-2 text-surface-500 max-w-md mx-auto">Our most popular picks chosen just for you</p> </div> ${hasProducts ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"> ${products.map((p) => renderTemplate`${renderComponent($$result3, "ProductCard", $$ProductCard, { "slug": p.slug, "name": p.name, "priceCents": p.priceCents, "compareAtPriceCents": p.compareAtPriceCents, "imageUrl": p.imageUrl, "status": p.status })}`)} </div> <div class="text-center mt-10"> <a href="/products" class="btn-secondary btn-lg">
View All Products &rarr;
</a> </div> ` })}` : renderTemplate`<div class="text-center py-16 text-surface-400"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path> </svg> <p>No products yet. Check back soon!</p> </div>`} </div> </section>  <section class="container-page section-padding"> <div class="text-center mb-12"> <span class="badge-green mb-4 inline-block">Why Choose Us</span> <h2 class="text-2xl md:text-3xl font-bold text-surface-900">Everything You Need</h2> <p class="mt-2 text-surface-500 max-w-md mx-auto">We make shopping easy, secure, and enjoyable</p> </div> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="card-hover p-6 text-center group"> <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-100 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path> </svg> </div> <h3 class="font-semibold text-surface-900 text-lg">Free Shipping</h3> <p class="mt-2 text-sm text-surface-500 leading-relaxed">On all orders over Rs. 5,000 across Nepal. Fast and reliable delivery.</p> </div> <div class="card-hover p-6 text-center group"> <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-100 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="font-semibold text-surface-900 text-lg">Secure Checkout</h3> <p class="mt-2 text-sm text-surface-500 leading-relaxed">Pay with QR scan or cash on delivery. Your data is always protected.</p> </div> <div class="card-hover p-6 text-center group"> <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-100 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path> </svg> </div> <h3 class="font-semibold text-surface-900 text-lg">Easy Returns</h3> <p class="mt-2 text-sm text-surface-500 leading-relaxed">Not satisfied? 30-day return policy. No questions asked.</p> </div> <div class="card-hover p-6 text-center group"> <div class="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-100 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="font-semibold text-surface-900 text-lg">24/7 Support</h3> <p class="mt-2 text-sm text-surface-500 leading-relaxed">We're here to help anytime. Reach out and we'll respond promptly.</p> </div> </div> </section>  <section class="relative overflow-hidden bg-gradient-to-r from-brand-800 via-brand-900 to-brand-950"> <div class="absolute inset-0"> <div class="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div> <div class="absolute bottom-0 left-0 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl"></div> </div> <div class="relative container-page py-20 text-center"> <h2 class="text-3xl md:text-4xl font-bold text-white">Ready to Start Shopping?</h2> <p class="mt-4 text-lg text-brand-200 max-w-lg mx-auto">Browse our collection and find something you love. Create an account for a seamless experience.</p> <div class="flex flex-wrap justify-center gap-4 mt-8"> <a href="/products" class="inline-flex items-center gap-2 bg-accent-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-accent-600 transition-all shadow-lg hover:shadow-xl hover:shadow-accent-500/25 active:scale-[0.98] text-base">
Browse Products
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> </svg> </a> <a href="/auth/register" class="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/20 transition-all ring-1 ring-white/20 backdrop-blur-sm text-base">
Create Account
</a> </div> </div> </section> ` })}`;
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
