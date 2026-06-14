globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getAuthUser, j as jsonError, s as sanitizeString, c as generateId, b as jsonOk } from '../../../chunks/validation_C3-TSEuz.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CzUJxHa9.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify([]), { status: 200 });
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  try {
    const all = await env.DB.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM product_categories pc WHERE pc.category_id = c.id) as product_count
      FROM categories c ORDER BY c.sort_order
    `).all();
    return new Response(JSON.stringify(all.results), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Categories GET error:", err);
    return jsonError(500, "Failed to load categories");
  }
};
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env?.DB) return jsonError(500, "Server error");
  const user = await getAuthUser(request, env.DB, "admin");
  if (!user) return jsonError(401, "Unauthorized");
  const body = await request.json().catch(() => null);
  if (!body) return jsonError(400, "Invalid request body");
  const name = sanitizeString(body.name, 100);
  if (!name) return jsonError(400, "Name required");
  const id = generateId("cat");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await env.DB.prepare("INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)").bind(id, name, slug).run();
  return jsonOk({ id });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
