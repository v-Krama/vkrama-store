import React from 'react'

const API = '/api/admin'

function authHeaders(token?: string) {
  const t = token || localStorage.getItem('vkrama_admin_token')
  return t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders(), ...options })
  if (res.status === 401) {
    localStorage.removeItem('vkrama_admin_token')
    window.location.href = '/admin/login'
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  React.useEffect(() => {
    setLoading(true)
    setError('')
    fn().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, deps)
  return { data, loading, error }
}

// --- Layout Components ---

function Sidebar() {
  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
  ]
  const current = window.location.pathname
  return React.createElement('aside', { style: { width: 240, background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 } },
    React.createElement('div', { style: { padding: '20px', fontSize: 18, fontWeight: 700, borderBottom: '1px solid #334155' } }, 'Vkrama Admin'),
    React.createElement('nav', { style: { padding: 10, flex: 1 } },
      links.map(l =>
        React.createElement('a', {
          key: l.href,
          href: l.href,
          style: {
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            color: current === l.href ? '#fff' : '#94a3b8',
            background: current === l.href ? '#334155' : 'transparent',
            borderRadius: 8, textDecoration: 'none', marginBottom: 2, fontSize: 14
          }
        }, l.icon, l.label)
      )
    ),
    React.createElement('div', { style: { padding: 14, borderTop: '1px solid #334155' } },
      React.createElement('button', {
        onClick: () => { localStorage.removeItem('vkrama_admin_token'); window.location.href = '/admin/login' },
        style: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, padding: 0 }
      }, 'Sign Out')
    )
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return React.createElement('div', { style: { display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' } },
    React.createElement(Sidebar, null),
    React.createElement('main', { style: { flex: 1, background: '#f8fafc', overflow: 'auto' } }, children)
  )
}

// --- Loading / Error ---

function Spinner() {
  return React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#64748b' } }, 'Loading...')
}

function ErrorMsg({ message }: { message: string }) {
  return React.createElement('div', { style: { padding: 20, color: '#dc2626', background: '#fef2f2', borderRadius: 8, margin: 20 } }, message)
}

function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
    React.createElement('h1', { style: { fontSize: 24, fontWeight: 700, color: '#0f172a' } }, title),
    action || null
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return React.createElement('div', {
    style: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 20, ...style }
  }, children)
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } },
      React.createElement('thead', null,
        React.createElement('tr', null,
          headers.map(h => React.createElement('th', {
            key: h, style: { textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }
          }, h))
        )
      ),
      React.createElement('tbody', null,
        rows.map((row, i) =>
          React.createElement('tr', {
            key: i,
            style: { borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#f8fafc' }
          }, row.map((cell, j) => React.createElement('td', { key: j, style: { padding: '12px 16px', color: '#334155' } }, cell)))
        )
      )
    )
  )
}

// --- Login Page ---

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as any).error || 'Invalid credentials')
      }
      const data = await res.json()
      localStorage.setItem('vkrama_admin_token', data.token)
      window.location.href = '/admin'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f5f9' } },
    React.createElement('form', {
      onSubmit: handleSubmit,
      style: { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: 360, maxWidth: '90%' }
    },
      React.createElement('h1', { style: { fontSize: 24, fontWeight: 700, marginBottom: 4, textAlign: 'center' } }, 'Vkrama Admin'),
      React.createElement('p', { style: { fontSize: 14, color: '#64748b', marginBottom: 24, textAlign: 'center' } }, 'Sign in to your account'),
      error && React.createElement('div', { style: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 14 } }, error),
      React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Email'),
        React.createElement('input', {
          type: 'email', value: email, required: true,
          onChange: e => setEmail(e.target.value),
          style: inputStyle
        })
      ),
      React.createElement('div', { style: { marginBottom: 24 } },
        React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Password'),
        React.createElement('input', {
          type: 'password', value: password, required: true,
          onChange: e => setPassword(e.target.value),
          style: inputStyle
        })
      ),
      React.createElement('button', {
        type: 'submit', disabled: loading,
        style: { width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }
      }, loading ? 'Signing in...' : 'Sign In')
    )
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', outline: 'none'
}

// --- Dashboard ---

function Dashboard() {
  const stats = useAsync(() => api('/stats'), [])
  if (stats.loading) return React.createElement(Spinner, null)
  if (stats.error) return React.createElement(ErrorMsg, { message: stats.error })

  const s = (stats.data as any) || {}
  const cards = [
    { label: 'Revenue', value: `Rs. ${((s.revenueCents || s.totalRevenue || 0) / 100).toLocaleString()}`, bg: '#f0fdf4' },
    { label: 'Orders', value: String(s.totalOrders || 0), bg: '#eef2ff' },
    { label: 'Customers', value: String(s.totalCustomers || 0), bg: '#fefce8' },
    { label: 'Products', value: String(s.totalProducts || 0), bg: '#eff6ff' },
  ]

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, { title: 'Dashboard' }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 } },
      cards.map(c =>
        React.createElement(Card, { key: c.label, style: { background: c.bg } },
          React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: '#0f172a' } }, c.value),
          React.createElement('div', { style: { fontSize: 14, color: '#64748b', marginTop: 4 } }, c.label)
        )
      )
    )
  )
}

// --- Products ---

function ProductsList() {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/products'), [])

  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(ErrorMsg, { message: error })

  let products = (data as any[]) || []
  if (search) products = products.filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase()))
  if (statusFilter) products = products.filter((p: any) => p.status === statusFilter)

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, {
      title: 'Products',
      action: React.createElement('a', {
        href: '/admin/products/new',
        style: { padding: '10px 20px', background: '#2563eb', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }
      }, '+ New Product')
    }),
    React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 20 } },
      React.createElement('input', {
        placeholder: 'Search products...', value: search,
        onChange: e => setSearch(e.target.value),
        style: { ...inputStyle, width: 260 }
      }),
      React.createElement('select', {
        value: statusFilter,
        onChange: e => setStatusFilter(e.target.value),
        style: { ...inputStyle, width: 140 }
      },
        React.createElement('option', { value: '' }, 'All Status'),
        React.createElement('option', { value: 'active' }, 'Active'),
        React.createElement('option', { value: 'draft' }, 'Draft'),
        React.createElement('option', { value: 'archived' }, 'Archived'),
      )
    ),
    React.createElement(Card, null,
      products.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No products found')
        : React.createElement(Table, {
          headers: ['Name', 'Price', 'Stock', 'Status', 'Created', ''],
          rows: products.map((p: any) => [
            React.createElement('a', { href: `/admin/products/${p.id}`, style: { color: '#2563eb', textDecoration: 'none', fontWeight: 500 } }, p.name),
            `Rs. ${((p.priceCents || 0) / 100).toLocaleString()}`,
            String(p.stock ?? 0),
            React.createElement('span', {
              style: {
                padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                background: p.status === 'active' ? '#dcfce7' : p.status === 'draft' ? '#fef9c3' : '#f1f5f9',
                color: p.status === 'active' ? '#16a34a' : p.status === 'draft' ? '#ca8a04' : '#64748b'
              }
            }, p.status || 'draft'),
            p.created_at ? new Date(p.created_at).toLocaleDateString() : '-',
            React.createElement('a', { href: `/admin/products/${p.id}`, style: { color: '#2563eb', textDecoration: 'none', fontSize: 13 } }, 'Edit')
          ])
        })
    )
  )
}

function ProductForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({
    name: '', slug: '', description: '', priceCents: '', compareAtPriceCents: '',
    costCents: '', stock: '', imageUrl: '', status: 'draft'
  })
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (id) {
      api(`/products/${id}`).then(data => {
        const p = data as any
        setForm({
          name: p.name || '', slug: p.slug || '', description: p.description || '',
          priceCents: p.priceCents ?? '', compareAtPriceCents: p.compareAtPriceCents ?? '',
          costCents: p.costCents ?? '', stock: p.stock ?? '', imageUrl: p.imageUrl || '',
          status: p.status || 'draft'
        })
        setLoaded(true)
      }).catch(e => setError(e.message))
    } else {
      setLoaded(true)
    }
  }, [id])

  const set = (field: string) => (e: any) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, priceCents: Number(form.priceCents), compareAtPriceCents: Number(form.compareAtPriceCents), costCents: Number(form.costCents), stock: Number(form.stock) }
      if (isEdit) {
        await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(payload) })
      }
      window.location.href = '/admin/products'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return React.createElement(Spinner, null)

  const fields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Slug', name: 'slug', type: 'text' },
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Price (cents)', name: 'priceCents', type: 'number' },
    { label: 'Compare At Price (cents)', name: 'compareAtPriceCents', type: 'number' },
    { label: 'Cost (cents)', name: 'costCents', type: 'number' },
    { label: 'Stock', name: 'stock', type: 'number' },
    { label: 'Image URL', name: 'imageUrl', type: 'text' },
  ]

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, { title: isEdit ? 'Edit Product' : 'New Product' }),
    error && React.createElement(ErrorMsg, { message: error }),
    React.createElement(Card, null,
      React.createElement('form', { onSubmit: handleSubmit, style: { maxWidth: 600 } },
        fields.map(f =>
          React.createElement('div', { key: f.name, style: { marginBottom: 16 } },
            React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, f.label),
            f.type === 'textarea'
              ? React.createElement('textarea', { value: form[f.name], onChange: set(f.name), rows: 4, style: { ...inputStyle, resize: 'vertical' } } as any)
              : React.createElement('input', { type: f.type, value: form[f.name], onChange: set(f.name), style: inputStyle })
          )
        ),
        React.createElement('div', { style: { marginBottom: 16 } },
          React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Status'),
          React.createElement('select', { value: form.status, onChange: set('status'), style: inputStyle },
            React.createElement('option', { value: 'draft' }, 'Draft'),
            React.createElement('option', { value: 'active' }, 'Active'),
            React.createElement('option', { value: 'archived' }, 'Archived'),
          )
        ),
        React.createElement('div', { style: { display: 'flex', gap: 12, marginTop: 24 } },
          React.createElement('button', { type: 'submit', disabled: saving, style: { padding: '12px 24px', background: saving ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' } }, saving ? 'Saving...' : 'Save'),
          React.createElement('a', { href: '/admin/products', style: { padding: '12px 24px', background: '#fff', color: '#334155', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none' } }, 'Cancel')
        )
      )
    )
  )
}

// --- Categories ---

function CategoriesList() {
  const [search, setSearch] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/categories'), [])

  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(ErrorMsg, { message: error })

  let categories = (data as any[]) || []
  if (search) categories = categories.filter((c: any) => c.name?.toLowerCase().includes(search.toLowerCase()))

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, { title: 'Categories' }),
    React.createElement('input', {
      placeholder: 'Search categories...', value: search,
      onChange: e => setSearch(e.target.value),
      style: { ...inputStyle, width: 260, marginBottom: 20 }
    }),
    React.createElement(Card, null,
      categories.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No categories found')
        : React.createElement(Table, {
          headers: ['Name', 'Slug', 'Description', 'Created', ''],
          rows: categories.map((c: any) => [
            c.name,
            c.slug,
            c.description || '-',
            c.created_at ? new Date(c.created_at).toLocaleDateString() : '-',
            React.createElement('span', { style: { color: '#94a3b8', fontSize: 13 } }, '—')
          ])
        })
    )
  )
}

// --- Orders ---

function OrdersList() {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/orders'), [])

  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(ErrorMsg, { message: error })

  let orders = (data as any[]) || []
  if (search) orders = orders.filter((o: any) => o.email?.toLowerCase().includes(search.toLowerCase()))
  if (statusFilter) orders = orders.filter((o: any) => o.status === statusFilter)

  const statusColors: Record<string, string> = {
    pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
    shipped: '#3b82f6', delivered: '#10b981', cancelled: '#ef4444'
  }

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, { title: 'Orders' }),
    React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 20 } },
      React.createElement('input', {
        placeholder: 'Search by email...', value: search,
        onChange: e => setSearch(e.target.value),
        style: { ...inputStyle, width: 260 }
      }),
      React.createElement('select', {
        value: statusFilter, onChange: e => setStatusFilter(e.target.value),
        style: { ...inputStyle, width: 140 }
      },
        React.createElement('option', { value: '' }, 'All Status'),
        ...['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(s =>
          React.createElement('option', { key: s, value: s }, s.charAt(0).toUpperCase() + s.slice(1))
        )
      )
    ),
    React.createElement(Card, null,
      orders.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No orders found')
        : React.createElement(Table, {
          headers: ['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''],
          rows: orders.map((o: any) => [
            React.createElement('span', { style: { fontFamily: 'monospace', fontSize: 12, color: '#64748b' } }, o.id?.slice(0, 8) || '-'),
            o.email || '-',
            `Rs. ${((o.totalCents || 0) / 100).toLocaleString()}`,
            o.paymentMethod || '-',
            React.createElement('span', {
              style: {
                padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                color: '#fff', background: statusColors[o.status] || '#64748b'
              }
            }, o.status || 'pending'),
            o.created_at ? new Date(o.created_at).toLocaleDateString() : '-',
            React.createElement('a', { href: `/admin/orders/${o.id}`, style: { color: '#2563eb', textDecoration: 'none', fontSize: 13 } }, 'View')
          ])
        })
    )
  )
}

function OrderShow() {
  const id = window.location.pathname.split('/').pop()
  const { data, loading, error } = useAsync(() => api(`/orders/${id}`), [id])

  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(ErrorMsg, { message: error })

  const o = data as any
  if (!o) return React.createElement(ErrorMsg, { message: 'Order not found' })

  const fields = [
    { label: 'Order ID', value: o.id },
    { label: 'Email', value: o.email },
    { label: 'Phone', value: o.phone },
    { label: 'Total', value: `Rs. ${((o.totalCents || 0) / 100).toLocaleString()}` },
    { label: 'Status', value: o.status },
    { label: 'Payment Method', value: o.paymentMethod },
    { label: 'Shipping Name', value: o.shippingName },
    { label: 'Shipping Phone', value: o.shippingPhone },
    { label: 'Address', value: [o.shippingLine1, o.shippingCity, o.shippingState].filter(Boolean).join(', ') },
    { label: 'Order Date', value: o.created_at ? new Date(o.created_at).toLocaleString() : '-' },
  ]

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, {
      title: `Order #${o.id?.slice(0, 8) || ''}`,
      action: React.createElement('a', { href: '/admin/orders', style: { color: '#2563eb', textDecoration: 'none', fontSize: 14 } }, '← Back')
    }),
    React.createElement(Card, null,
      fields.map(f =>
        React.createElement('div', { key: f.label, style: { display: 'flex', padding: '10px 0', borderBottom: '1px solid #f1f5f9' } },
          React.createElement('div', { style: { width: 160, fontSize: 14, color: '#64748b', fontWeight: 500 } }, f.label),
          React.createElement('div', { style: { fontSize: 14, color: '#0f172a' } }, f.value || '-')
        )
      )
    )
  )
}

// --- Customers ---

function CustomersList() {
  const [search, setSearch] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/customers'), [])

  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(ErrorMsg, { message: error })

  let customers = (data as any[]) || []
  if (search) customers = customers.filter((c: any) => c.email?.toLowerCase().includes(search.toLowerCase()))

  return React.createElement('div', { style: { padding: 30 } },
    React.createElement(PageHeader, { title: 'Customers' }),
    React.createElement('input', {
      placeholder: 'Search by email...', value: search,
      onChange: e => setSearch(e.target.value),
      style: { ...inputStyle, width: 260, marginBottom: 20 }
    }),
    React.createElement(Card, null,
      customers.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No customers found')
        : React.createElement(Table, {
          headers: ['Email', 'Name', 'Phone', 'Registered'],
          rows: customers.map((c: any) => [
            c.email || '-',
            c.name || '-',
            c.phone || '-',
            c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'
          ])
        })
    )
  )
}

// --- Router ---

function matchRoute(path: string) {
  const parts = path.split('/').filter(Boolean)
  // /admin → dashboard
  if (path === '/admin' || path === '/admin/') return { page: 'dashboard' }
  // /admin/login
  if (path === '/admin/login') return { page: 'login' }
  // /admin/products/new
  if (parts[1] === 'products' && parts[2] === 'new') return { page: 'product-new' }
  // /admin/products/:id
  if (parts[1] === 'products' && parts[2]) return { page: 'product-edit', params: { id: parts[2] } }
  // /admin/products
  if (parts[1] === 'products') return { page: 'products' }
  // /admin/categories
  if (parts[1] === 'categories') return { page: 'categories' }
  // /admin/orders/:id
  if (parts[1] === 'orders' && parts[2]) return { page: 'order-show', params: { id: parts[2] } }
  // /admin/orders
  if (parts[1] === 'orders') return { page: 'orders' }
  // /admin/customers
  if (parts[1] === 'customers') return { page: 'customers' }
  return { page: 'dashboard' }
}

export default function AdminApp() {
  const [path, setPath] = React.useState(window.location.pathname)

  React.useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const route = matchRoute(path)
  const token = localStorage.getItem('vkrama_admin_token')

  // Not logged in and not on login page → redirect
  if (!token && route.page !== 'login') {
    window.location.href = '/admin/login'
    return null
  }

  // On login page
  if (route.page === 'login') {
    return React.createElement(LoginPage, null)
  }

  // Logged in — render authenticated pages
  let content: React.ReactNode
  switch (route.page) {
    case 'dashboard':
      content = React.createElement(Dashboard, null)
      break
    case 'products':
      content = React.createElement(ProductsList, null)
      break
    case 'product-new':
      content = React.createElement(ProductForm, null)
      break
    case 'product-edit':
      content = React.createElement(ProductForm, { id: (route.params as any).id })
      break
    case 'categories':
      content = React.createElement(CategoriesList, null)
      break
    case 'orders':
      content = React.createElement(OrdersList, null)
      break
    case 'order-show':
      content = React.createElement(OrderShow, null)
      break
    case 'customers':
      content = React.createElement(CustomersList, null)
      break
    default:
      content = React.createElement(Dashboard, null)
  }

  return React.createElement(Layout, null, content)
}
