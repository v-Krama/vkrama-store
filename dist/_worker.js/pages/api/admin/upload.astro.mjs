globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as verifyToken, n as nanoid } from '../../../chunks/auth_B3dqqjmA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Drbtiq9T.mjs';

const POST = async ({ request, locals }) => {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
  const payload = await verifyToken(auth.slice(7));
  if (!payload || payload.userType !== "admin") return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.R2_STORE) return new Response(JSON.stringify({ error: "Storage not configured" }), { status: 500 });
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "products";
    if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    const ext = file.name.split(".").pop() || "jpg";
    const key = `${folder}/${nanoid(16)}.${ext}`;
    const buffer = await file.arrayBuffer();
    await env.R2_STORE.put(key, buffer, {
      httpMetadata: { contentType: file.type }
    });
    return new Response(JSON.stringify({ url: `/api/image/${key}`, key }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
