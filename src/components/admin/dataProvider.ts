import type { DataProvider } from 'react-admin'
import { stringify } from 'query-string'

const API_BASE = '/api/admin'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('vkrama_admin_token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

function toRecord(row: any) {
  return { ...row, id: row.id }
}

function sortList(list: any[], field: string, order: string) {
  const sorted = [...list].sort((a, b) => {
    const va = a[field] ?? ''
    const vb = b[field] ?? ''
    if (typeof va === 'number' && typeof vb === 'number') return va - vb
    return String(va).localeCompare(String(vb))
  })
  return order === 'DESC' ? sorted.reverse() : sorted
}

function filterList(list: any[], filter: Record<string, any>) {
  if (!filter || Object.keys(filter).length === 0) return list
  return list.filter((item) =>
    Object.entries(filter).every(([key, val]) => {
      if (!val) return true
      const itemVal = item[key]
      if (typeof itemVal === 'string') return itemVal.toLowerCase().includes(String(val).toLowerCase())
      return itemVal === val
    })
  )
}

const cache = new Map<string, { data: any[]; ts: number }>()
const CACHE_TTL = 5000

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return Promise.resolve(cached.data as T)
  return fetcher().then((data) => {
    cache.set(key, { data: data as any[], ts: Date.now() })
    return data
  })
}

function bustCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { filter = {}, sort = { field: 'created_at', order: 'DESC' }, pagination = { page: 1, perPage: 25 } } = params

    let all: any[]
    switch (resource) {
      case 'products':
        all = await cachedFetch('products', async () => {
          const res = await fetch(`${API_BASE}/products`, { headers: authHeaders() })
          if (!res.ok) throw new Error('Failed to fetch')
          return ((await res.json()) || []).map(toRecord)
        })
        if (filter.status) all = all.filter((p) => p.status === filter.status)
        if (filter.q) all = all.filter((p) => p.name?.toLowerCase().includes(filter.q.toLowerCase()))
        break
      case 'categories':
        all = await cachedFetch('categories', async () => {
          const res = await fetch(`${API_BASE}/categories`, { headers: authHeaders() })
          if (!res.ok) throw new Error('Failed to fetch')
          return ((await res.json()) || []).map(toRecord)
        })
        if (filter.q) all = all.filter((c) => c.name?.toLowerCase().includes(filter.q.toLowerCase()))
        break
      case 'orders':
        all = await cachedFetch('orders', async () => {
          const query = filter.status ? `?status=${filter.status}` : ''
          const res = await fetch(`${API_BASE}/orders${query}`, { headers: authHeaders() })
          if (!res.ok) throw new Error('Failed to fetch')
          return ((await res.json()) || []).map(toRecord)
        })
        if (filter.q) all = all.filter((o) => o.email?.toLowerCase().includes(filter.q.toLowerCase()))
        break
      case 'customers':
        all = await cachedFetch('customers', async () => {
          const res = await fetch(`${API_BASE}/customers`, { headers: authHeaders() })
          if (!res.ok) throw new Error('Failed to fetch')
          return ((await res.json()) || []).map(toRecord)
        })
        if (filter.q) all = all.filter((c) => c.email?.toLowerCase().includes(filter.q.toLowerCase()))
        break
      default:
        all = []
    }

    const filtered = filterList(all, filter)
    const sorted = sortList(filtered, sort.field, sort.order)
    const start = (pagination.page - 1) * pagination.perPage
    const page = sorted.slice(start, start + pagination.perPage)

    return { data: page, total: sorted.length }
  },

  getMany: async (resource, params) => {
    const { data } = await dataProvider.getList(resource, {
      filter: { id: params.ids[0] },
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
    })
    return { data: data.filter((r) => (params.ids as string[]).includes(r.id)) }
  },

  getManyReference: async (resource, params) => {
    return dataProvider.getList(resource, {
      sort: params.sort,
      filter: { ...params.filter, [params.target]: params.id },
      pagination: params.pagination,
    })
  },

  getOne: async (resource, params) => {
    const res = await fetch(`${API_BASE}/${resource}/${params.id}`, { headers: authHeaders() })
    if (!res.ok) throw new Error('Not found')
    const data = await res.json()
    return { data: toRecord(data) }
  },

  create: async (resource, params) => {
    const res = await fetch(`${API_BASE}/${resource}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(params.data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).error || 'Creation failed')
    }
    const data = await res.json()
    bustCache(resource)
    return { data: toRecord(data) }
  },

  update: async (resource, params) => {
    const res = await fetch(`${API_BASE}/${resource}/${params.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(params.data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).error || 'Update failed')
    }
    const data = await res.json()
    bustCache(resource)
    return { data: toRecord(data) }
  },

  updateMany: async (resource, params) => {
    const results = await Promise.all(
      (params.ids as string[]).map((id) =>
        fetch(`${API_BASE}/${resource}/${id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(params.data),
        }).then((r) => r.json())
      )
    )
    bustCache(resource)
    return { data: results.map(toRecord) }
  },

  delete: async (resource, params) => {
    const res = await fetch(`${API_BASE}/${resource}/${params.id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Delete failed')
    bustCache(resource)
    return { data: toRecord(params.previousData || { id: params.id }) }
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      (params.ids as string[]).map((id) =>
        fetch(`${API_BASE}/${resource}/${id}`, { method: 'DELETE', headers: authHeaders() })
      )
    )
    bustCache(resource)
    return { data: (params.ids as string[]).map((id) => ({ id })) }
  },
}
