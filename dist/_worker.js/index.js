globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_CzUJxHa9.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CMaFs6by.mjs';
import { manifest } from './manifest_Ca5f2iON.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/500.astro.mjs');
const _page3 = () => import('./pages/account/addresses.astro.mjs');
const _page4 = () => import('./pages/account/orders/_id_.astro.mjs');
const _page5 = () => import('./pages/account/orders.astro.mjs');
const _page6 = () => import('./pages/account/profile.astro.mjs');
const _page7 = () => import('./pages/admin/_---path_.astro.mjs');
const _page8 = () => import('./pages/api/account/profile.astro.mjs');
const _page9 = () => import('./pages/api/addresses/_id_.astro.mjs');
const _page10 = () => import('./pages/api/addresses.astro.mjs');
const _page11 = () => import('./pages/api/admin/categories/_id_.astro.mjs');
const _page12 = () => import('./pages/api/admin/categories.astro.mjs');
const _page13 = () => import('./pages/api/admin/customers.astro.mjs');
const _page14 = () => import('./pages/api/admin/login.astro.mjs');
const _page15 = () => import('./pages/api/admin/logout.astro.mjs');
const _page16 = () => import('./pages/api/admin/orders/_id_.astro.mjs');
const _page17 = () => import('./pages/api/admin/orders.astro.mjs');
const _page18 = () => import('./pages/api/admin/products/_id_.astro.mjs');
const _page19 = () => import('./pages/api/admin/products.astro.mjs');
const _page20 = () => import('./pages/api/admin/stats.astro.mjs');
const _page21 = () => import('./pages/api/admin/upload.astro.mjs');
const _page22 = () => import('./pages/api/auth/login.astro.mjs');
const _page23 = () => import('./pages/api/auth/logout.astro.mjs');
const _page24 = () => import('./pages/api/auth/me.astro.mjs');
const _page25 = () => import('./pages/api/auth/register.astro.mjs');
const _page26 = () => import('./pages/api/cart/checkout.astro.mjs');
const _page27 = () => import('./pages/api/categories.astro.mjs');
const _page28 = () => import('./pages/api/image/_---key_.astro.mjs');
const _page29 = () => import('./pages/api/orders/_id_.astro.mjs');
const _page30 = () => import('./pages/api/orders.astro.mjs');
const _page31 = () => import('./pages/api/products/_slug_.astro.mjs');
const _page32 = () => import('./pages/api/products.astro.mjs');
const _page33 = () => import('./pages/auth/login.astro.mjs');
const _page34 = () => import('./pages/auth/logout.astro.mjs');
const _page35 = () => import('./pages/auth/register.astro.mjs');
const _page36 = () => import('./pages/cart.astro.mjs');
const _page37 = () => import('./pages/checkout/confirm/_orderid_.astro.mjs');
const _page38 = () => import('./pages/checkout/success.astro.mjs');
const _page39 = () => import('./pages/checkout.astro.mjs');
const _page40 = () => import('./pages/products/_slug_.astro.mjs');
const _page41 = () => import('./pages/products.astro.mjs');
const _page42 = () => import('./pages/search.astro.mjs');
const _page43 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/500.astro", _page2],
    ["src/pages/account/addresses.astro", _page3],
    ["src/pages/account/orders/[id].astro", _page4],
    ["src/pages/account/orders.astro", _page5],
    ["src/pages/account/profile.astro", _page6],
    ["src/pages/admin/[...path].astro", _page7],
    ["src/pages/api/account/profile.ts", _page8],
    ["src/pages/api/addresses/[id].ts", _page9],
    ["src/pages/api/addresses/index.ts", _page10],
    ["src/pages/api/admin/categories/[id].ts", _page11],
    ["src/pages/api/admin/categories.ts", _page12],
    ["src/pages/api/admin/customers.ts", _page13],
    ["src/pages/api/admin/login.ts", _page14],
    ["src/pages/api/admin/logout.ts", _page15],
    ["src/pages/api/admin/orders/[id].ts", _page16],
    ["src/pages/api/admin/orders.ts", _page17],
    ["src/pages/api/admin/products/[id].ts", _page18],
    ["src/pages/api/admin/products.ts", _page19],
    ["src/pages/api/admin/stats.ts", _page20],
    ["src/pages/api/admin/upload.ts", _page21],
    ["src/pages/api/auth/login.ts", _page22],
    ["src/pages/api/auth/logout.ts", _page23],
    ["src/pages/api/auth/me.ts", _page24],
    ["src/pages/api/auth/register.ts", _page25],
    ["src/pages/api/cart/checkout.ts", _page26],
    ["src/pages/api/categories/index.ts", _page27],
    ["src/pages/api/image/[...key].ts", _page28],
    ["src/pages/api/orders/[id].ts", _page29],
    ["src/pages/api/orders/index.ts", _page30],
    ["src/pages/api/products/[slug].ts", _page31],
    ["src/pages/api/products/index.ts", _page32],
    ["src/pages/auth/login.astro", _page33],
    ["src/pages/auth/logout.astro", _page34],
    ["src/pages/auth/register.astro", _page35],
    ["src/pages/cart.astro", _page36],
    ["src/pages/checkout/confirm/[orderId].astro", _page37],
    ["src/pages/checkout/success.astro", _page38],
    ["src/pages/checkout/index.astro", _page39],
    ["src/pages/products/[slug].astro", _page40],
    ["src/pages/products/index.astro", _page41],
    ["src/pages/search.astro", _page42],
    ["src/pages/index.astro", _page43]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
