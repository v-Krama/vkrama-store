globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Ce7Lw4RO.mjs';
import { $ as $$Base } from '../../chunks/Base_COq19l6H.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "My Profile" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-8"> <div class="max-w-2xl mx-auto"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-2xl font-bold text-surface-900">My Profile</h1> <p class="text-sm text-surface-500 mt-1">Manage your account information</p> </div> <a href="/account/orders" class="btn-secondary btn-sm">&larr; Orders</a> </div> <div id="profile-content"> <div class="card p-8 text-center text-surface-500"> <div class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
Loading profile...
</div> </div> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/account/profile.astro?astro&type=script&index=0&lang.ts")}`;
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
