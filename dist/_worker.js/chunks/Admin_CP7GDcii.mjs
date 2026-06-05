globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, m as maybeRenderHead, r as renderTemplate, e as createAstro, n as renderHead, k as renderComponent, o as renderSlot, l as renderScript } from './astro/server_B3LaWqT_.mjs';
/* empty css                              */

const $$AdminSidebar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<aside class="w-64 bg-gray-900 text-white flex flex-col shrink-0"> <div class="p-6"> <a href="/admin" class="text-xl font-bold tracking-tight">vkrama Admin</a> </div> <nav class="flex-1 px-4 space-y-1"> <a href="/admin" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path> </svg>
Dashboard
</a> <a href="/admin/products" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path> </svg>
Products
</a> <a href="/admin/categories" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg>
Categories
</a> <a href="/admin/orders" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path> </svg>
Orders
</a> <a href="/admin/customers" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path> </svg>
Customers
</a> </nav> <div class="p-4 border-t border-gray-700"> <a href="/" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Back to Store
</a> </div> </aside>`;
}, "/home/v-krama/vkrama-store/src/components/layout/AdminSidebar.astro", void 0);

const $$Astro = createAstro("https://vkrama.com");
const $$Admin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title} — vkrama Admin</title>${renderHead()}</head> <body class="bg-surface-50"> <div class="flex h-screen overflow-hidden"> ${renderComponent($$result, "AdminSidebar", $$AdminSidebar, {})} <div class="flex-1 flex flex-col overflow-hidden"> <header class="sticky top-0 z-10 bg-white border-b border-surface-200 px-6 py-3"> <div class="flex items-center justify-between"> <h1 class="text-lg font-semibold text-surface-900">${title}</h1> <div class="flex items-center gap-3"> <span class="text-sm text-surface-400" id="admin-email"></span> <span class="w-px h-4 bg-surface-200"></span> <a href="/" class="text-sm text-surface-500 hover:text-surface-700 transition-colors" target="_blank">
View Store
</a> <button id="logout-btn" class="btn-ghost btn-sm text-red-600 hover:text-red-700">Logout</button> </div> </div> </header> <main class="flex-1 overflow-y-auto p-6"> ${renderSlot($$result, $$slots["default"])} </main> </div> </div> ${renderScript($$result, "/home/v-krama/vkrama-store/src/layouts/Admin.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/v-krama/vkrama-store/src/layouts/Admin.astro", void 0);

export { $$Admin as $ };
