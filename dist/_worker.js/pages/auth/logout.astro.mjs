globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { e as createAstro, f as createComponent } from '../../chunks/astro/server_B3LaWqT_.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Astro = createAstro("https://vkrama.com");
const $$Logout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Logout;
  return Astro2.redirect("/");
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
