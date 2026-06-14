globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_DUQEdt6X.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const $$Logout = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/auth/logout.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/auth/logout.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/auth/logout.astro";
const $$url = "/auth/logout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Logout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
