globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DUQEdt6X.mjs';
import { $ as $$Base } from '../../chunks/Base_LuIWtNvf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const $$Orders = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "My Orders", "description": "View your order history at vkrama." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative min-h-[80vh] bg-surface-50/50"> <div class="container-page py-8 lg:py-12"> <div class="max-w-4xl mx-auto"> <!-- Header --> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"> <div> <h1 class="text-2xl lg:text-3xl font-bold text-surface-900 tracking-tight">My Orders</h1> <p class="text-sm text-surface-500 mt-1">View and track your orders</p> </div> <div class="flex items-center gap-2"> <a href="/account/profile" class="btn-secondary btn-sm"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
Profile
</a> <a href="/auth/logout" class="btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
Sign Out
</a> </div> </div> <div id="orders-list"> <div class="rounded-2xl bg-white border border-surface-200 p-12 text-center text-surface-500"> <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div> <p class="text-sm">Loading orders...</p> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/orders.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/account/orders.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/account/orders.astro";
const $$url = "/account/orders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Orders,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
