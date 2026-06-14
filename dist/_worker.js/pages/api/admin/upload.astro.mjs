globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsonError, g as getAuthUser, n as nanoid } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_eNrc7DJ3.mjs';

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const MAGIC_BYTES = {
  jpeg: new Uint8Array([255, 216, 255]),
  png: new Uint8Array([137, 80, 78, 71]),
  gif: new Uint8Array([71, 73, 70]),
  webp: new Uint8Array([82, 73, 70, 70])
};
function checkMagicBytes(buffer, ext) {
  const magic = MAGIC_BYTES[ext];
  if (!magic) return false;
  const view = new Uint8Array(buffer, 0, magic.length);
  return magic.every((b, i) => view[i] === b);
}
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.R2_STORE) return jsonError(500, "Storage not configured");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) return jsonError(400, "Invalid form data");
    const file = formData.get("file");
    if (!file) return jsonError(400, "No file provided");
    if (file.size > MAX_SIZE) return jsonError(400, "File too large. Maximum 5MB.");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return jsonError(400, "Invalid file type. Allowed: JPG, PNG, GIF, WebP.");
    }
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return jsonError(400, "Invalid file extension.");
    }
    const buffer = await file.arrayBuffer();
    if (!checkMagicBytes(buffer, ext)) {
      return jsonError(400, "Invalid file content.");
    }
    const folder = String(formData.get("folder") || "products").replace(/[^a-z0-9_-]/gi, "");
    const key = `${folder}/${nanoid(16)}.${ext}`;
    await env.R2_STORE.put(key, buffer, {
      httpMetadata: { contentType: file.type }
    });
    return new Response(JSON.stringify({ url: `/api/image/${key}`, key }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return jsonError(500, "Upload failed");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
