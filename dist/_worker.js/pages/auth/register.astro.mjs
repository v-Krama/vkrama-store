globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_DFXjdrHI.mjs';
import { $ as $$Base } from '../../chunks/Base_CghCu4Vd.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Create Account" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container-page py-16"> <div class="max-w-md mx-auto"> <div class="text-center mb-8"> <h1 class="text-2xl font-bold text-surface-900">Create Account</h1> <p class="text-surface-500 mt-1">Join vkrama today</p> </div> <form id="register-form" class="card p-6 space-y-4"> <div> <label class="label" for="name">Name</label> <input type="text" id="name" class="input" required> </div> <div> <label class="label" for="email">Email</label> <input type="email" id="email" class="input" required> </div> <div> <label class="label" for="password">Password</label> <input type="password" id="password" class="input"${addAttribute(8, "minlength")} required> <p class="text-xs text-surface-400 mt-1">At least 8 characters</p> </div> <p id="error-msg" class="text-sm text-red-600 hidden"></p> <button type="submit" class="btn-primary w-full btn-lg">Create Account</button> <p class="text-sm text-center text-surface-500">
Already have an account? <a href="/auth/login" class="link">Sign In</a> </p> </form> </div> </div> ` })} ${renderScript($$result, "/home/v-krama/vkrama-store/src/pages/auth/register.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/v-krama/vkrama-store/src/pages/auth/register.astro", void 0);

const $$file = "/home/v-krama/vkrama-store/src/pages/auth/register.astro";
const $$url = "/auth/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
