globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_C3QtnHAK.mjs';

const GET = async ({ params, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.R2_STORE) return new Response("Not found", { status: 404 });
  const path = params.path;
  if (!path) return new Response("Not found", { status: 404 });
  try {
    const object = await env.R2_STORE.get(path);
    if (!object) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new Response(object.body, { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
