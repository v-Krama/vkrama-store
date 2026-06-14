globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DUQEdt6X.mjs';
import { $ as $$Base } from '../../chunks/Base_LuIWtNvf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "My Profile" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative min-h-[80vh] bg-surface-50/50"> <div class="container-page py-8 lg:py-12"> <div class="max-w-2xl mx-auto"> <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"> <div> <h1 class="text-2xl lg:text-3xl font-bold text-surface-900 tracking-tight">My Profile</h1> <p class="text-sm text-surface-500 mt-1">Manage your account information</p> </div> <div class="flex items-center gap-2"> <a href="/account/orders" class="btn-secondary btn-sm"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
Orders
</a> <a href="/account/addresses" class="btn-secondary btn-sm"> <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
Addresses
</a> </div> </div> <div id="profile-content"> <div class="rounded-2xl bg-white border border-surface-200 p-12 text-center text-surface-500"> <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div> <p class="text-sm">Loading profile...</p> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/profile.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/account/profile.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/account/profile.astro";
const $$url = "/account/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
