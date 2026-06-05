globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, n as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_B3LaWqT_.mjs';
/* empty css                                         */
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Admin Login — vkrama</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body class="bg-gray-950 min-h-screen flex items-center justify-center"> <div class="w-full max-w-sm mx-4"> <div class="text-center mb-8"> <div class="mx-auto w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mb-4"> <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <h1 class="text-2xl font-bold text-white tracking-tight">Admin Login</h1> <p class="text-gray-400 mt-1 text-sm">Sign in to manage vkrama store</p> </div> <form id="login-form" class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 shadow-2xl"> <div> <label class="block text-sm font-medium text-gray-300 mb-1.5" for="email">Email</label> <input type="email" id="email" class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="admin@vkrama.com" required> </div> <div> <label class="block text-sm font-medium text-gray-300 mb-1.5" for="password">Password</label> <input type="password" id="password" class="block w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Enter your password" required> </div> <p id="error-msg" class="text-sm text-red-400 hidden"></p> <button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
Sign In
</button> </form> <p class="text-center mt-6"> <a href="/" class="text-sm text-gray-500 hover:text-gray-300 transition-colors">&larr; Back to store</a> </p> </div> ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
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
