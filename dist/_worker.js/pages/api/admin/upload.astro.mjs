globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as checkAdminAuth, n as nanoid } from '../../../chunks/auth_rVfLOqBr.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const POST = async ({ request, locals }) => {
  if (!await checkAdminAuth(request)) return new Response("Unauthorized", { status: 401 });
  const env = locals.runtime?.env;
  if (!env?.R2_STORE) return new Response(JSON.stringify({ error: "Storage not configured" }), { status: 500 });
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "products";
    if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File too large. Maximum 5MB." }), { status: 400 });
    }
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file type. Allowed: JPG, PNG, GIF, WebP." }), { status: 400 });
    }
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!allowedExts.includes(ext)) {
      return new Response(JSON.stringify({ error: "Invalid file extension." }), { status: 400 });
    }
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
