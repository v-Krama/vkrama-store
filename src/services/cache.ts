const DEFAULT_TTL = 300
const LONG_TTL = 3600

type CacheValue = string | number | boolean | Record<string, unknown> | unknown[]

export async function cacheGet<T = CacheValue>(
  kv: KVNamespace,
  key: string,
): Promise<T | null> {
  try {
    const value = await kv.get(key, "json")
    return value as T | null
  } catch {
    return null
  }
}

export async function cacheSet(
  kv: KVNamespace,
  key: string,
  value: CacheValue,
  ttl = DEFAULT_TTL,
): Promise<void> {
  await kv.put(key, JSON.stringify(value), { expirationTtl: ttl })
}

export async function cacheDelete(kv: KVNamespace, key: string): Promise<void> {
  await kv.delete(key)
}

export async function cacheGetOrSet<T = CacheValue>(
  kv: KVNamespace,
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL,
): Promise<T> {
  const cached = await cacheGet<T>(kv, key)
  if (cached !== null) return cached

  const value = await fetcher()
  await cacheSet(kv, key, value as CacheValue, ttl)
  return value
}

export function buildCacheKey(prefix: string, ...parts: (string | number | undefined)[]): string {
  return `${prefix}:${parts.filter(Boolean).join(":")}`
}

export const CacheKeys = {
  product: (slug: string) => buildCacheKey("product", slug),
  productList: (filters: string) => buildCacheKey("products", filters),
  category: (slug: string) => buildCacheKey("category", slug),
  categoryList: () => buildCacheKey("categories", "list"),
  collection: (slug: string) => buildCacheKey("collection", slug),
  featured: () => buildCacheKey("products", "featured"),
  stats: () => buildCacheKey("admin", "stats"),
  settings: () => buildCacheKey("settings", "all"),
  page: (slug: string) => buildCacheKey("page", slug),
} as const

export function invalidateProductCache(kv: KVNamespace, slug: string) {
  return Promise.all([
    cacheDelete(kv, CacheKeys.product(slug)),
    cacheDelete(kv, CacheKeys.productList("all")),
    cacheDelete(kv, CacheKeys.featured()),
  ])
}
