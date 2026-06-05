globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, n as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_B3LaWqT_.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Admin Login — vkrama</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link href="/src/styles/global.css" rel="stylesheet">${renderHead()}</head> <body class="bg-surface-100 min-h-screen flex items-center justify-center"> <div class="w-full max-w-sm mx-4 animate-slide-up"> <div class="text-center mb-8"> <a href="/" class="text-3xl font-extrabold text-brand-600 tracking-tight">vkrama</a> <p class="text-surface-500 mt-2 text-sm">Admin Panel</p> </div> <form id="login-form" class="card p-6 space-y-4"> <div> <label class="label" for="email">Email</label> <input type="email" id="email" class="input" required> </div> <div> <label class="label" for="password">Password</label> <input type="password" id="password" class="input" required> </div> <p id="error-msg" class="text-sm text-red-600 hidden"></p> <button type="submit" class="btn-primary w-full">Sign In</button> </form> </div> ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/v-krama/vkrama-store/src/pages/admin/login.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
