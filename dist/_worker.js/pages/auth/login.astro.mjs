globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B3LaWqT_.mjs';
import { $ as $$Base } from '../../chunks/Base_DNYhlJj2.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Sign In" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-16"> <div class="max-w-md mx-auto"> <div class="text-center mb-8"> <h1 class="text-2xl font-bold text-surface-900">Welcome Back</h1> <p class="text-surface-500 mt-1">Sign in to your account</p> </div> <form id="login-form" class="card p-6 space-y-4"> <div> <label class="label" for="email">Email</label> <input type="email" id="email" class="input" required> </div> <div> <label class="label" for="password">Password</label> <input type="password" id="password" class="input" required> </div> <p id="error-msg" class="text-sm text-red-600 hidden"></p> <button type="submit" class="btn-primary w-full btn-lg">Sign In</button> <p class="text-sm text-center text-surface-500">
Don't have an account? <a href="/auth/register" class="link">Register</a> </p> </form> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/auth/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/auth/login.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/auth/login.astro";
const $$url = "/auth/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
