globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser, j as jsonError } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?";
    let params = [limit, offset];
    if (status) {
      query = "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
      params = [status, limit, offset];
    }
    const result = await env.DB.prepare(query).bind(...params).all();
    return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Orders GET error:", err);
    return jsonError(500, "Failed to load orders");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
