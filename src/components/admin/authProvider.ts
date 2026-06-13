import type { AuthProvider } from 'react-admin'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as any).error || 'Invalid credentials')
    }
    const data = await res.json()
    localStorage.setItem('vkrama_admin_token', data.token)
    localStorage.setItem('vkrama_admin_user', JSON.stringify({ email: data.email, name: data.name }))
  },
  logout: async () => {
    const token = localStorage.getItem('vkrama_admin_token')
    if (token) {
      await fetch('/api/admin/logout', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    localStorage.removeItem('vkrama_admin_token')
    localStorage.removeItem('vkrama_admin_user')
  },
  checkAuth: async () => {
    const token = localStorage.getItem('vkrama_admin_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) throw new Error('Session expired')
  },
  checkError: async (error) => {
    const e = error as any
    if (e?.status === 401 || e?.status === 403) {
      localStorage.removeItem('vkrama_admin_token')
      throw new Error('Session expired')
    }
  },
  getPermissions: async () => {
    const raw = localStorage.getItem('vkrama_admin_user')
    return raw ? JSON.parse(raw) : null
  },
}
