globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Base } from '../chunks/Base_BrzleQZO.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Search Products" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-4xl mx-auto"> <div class="mb-8"> <h1 class="text-2xl font-bold text-surface-900 mb-4">Search Products</h1> <div class="relative"> <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <input type="text" id="search-input" placeholder="Search products..." class="w-full pl-11 pr-4 py-3.5 text-base border border-surface-300 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all" autofocus> </div> </div> <div id="search-results"> <div class="text-center py-16 text-surface-400"> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <p>Start typing to find products</p> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/search.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/search.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
