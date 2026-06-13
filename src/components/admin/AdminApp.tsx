import React from 'react'

const API = '/api/admin'

function authHeaders(token?: string) {
  const t = token || localStorage.getItem('vkrama_admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function api(path: string, options?: RequestInit) {
  const headers: Record<string, string> = authHeaders() as Record<string, string>
  if (options?.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(`${API}${path}`, { headers, ...options })
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
    setLoading(true); setError('')
    fn().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, deps)
  return { data, loading, error }
}

// --- Style helpers ---

const inputS: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6,
  fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit'
}
const btnS = (primary = true, disabled = false): React.CSSProperties => ({
  padding: '10px 20px', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
  background: disabled ? '#93c5fd' : primary ? '#2563eb' : '#fff',
  color: primary ? '#fff' : '#334155',
  border: primary ? 'none' : '1px solid #d1d5db',
  textDecoration: 'none', display: 'inline-block'
})

// --- Layout ---

function Sidebar() {
  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
  ]
  const cur = window.location.pathname
  return React.createElement('aside', { style: { width: 240, background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 } },
    React.createElement('div', { style: { padding: '20px', fontSize: 18, fontWeight: 700, borderBottom: '1px solid #334155' } }, 'Vkrama'),
    React.createElement('nav', { style: { padding: 10, flex: 1 } },
      links.map(l =>
        React.createElement('a', {
          key: l.href, href: l.href,
          style: {
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            color: cur === l.href ? '#fff' : '#94a3b8',
            background: cur === l.href ? '#334155' : 'transparent',
            borderRadius: 8, textDecoration: 'none', marginBottom: 2, fontSize: 14
          }
        }, l.icon, l.label)
      )
    ),
    React.createElement('div', { style: { padding: 14, borderTop: '1px solid #334155' } },
      React.createElement('button', {
        onClick: () => { localStorage.removeItem('vkrama_admin_token'); window.location.href = '/admin/login' },
        style: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit' }
      }, 'Sign Out')
    )
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return React.createElement('div', { style: { display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' } },
    React.createElement(Sidebar, null),
    React.createElement('main', { style: { flex: 1, background: '#f8fafc', overflow: 'auto', padding: 30 } }, children)
  )
}

function Spinner() { return React.createElement('div', { style: { textAlign: 'center', color: '#64748b', padding: 40 } }, 'Loading...') }
function Err({ msg }: { msg: string }) { return React.createElement('div', { style: { padding: 14, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginBottom: 16, fontSize: 14 } }, msg) }
function PageHd({ title, action }: { title: string; action?: React.ReactNode }) {
  return React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } },
    React.createElement('h1', { style: { fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 } }, title),
    action || null
  )
}
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return React.createElement('div', { style: { background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24, ...style } }, children)
}
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } },
      React.createElement('thead', null,
        React.createElement('tr', null, headers.map(h =>
          React.createElement('th', { key: h, style: { textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' } }, h)
        ))
      ),
      React.createElement('tbody', null, rows.map((row, i) =>
        React.createElement('tr', { key: i, style: { borderBottom: '1px solid #f1f5f9', background: i % 2 ? '#f8fafc' : '#fff' } },
          row.map((cell, j) => React.createElement('td', { key: j, style: { padding: '12px 16px', color: '#334155' } }, cell))
        )
      ))
    )
  )
}

function cents(c: number) { return `Rs. ${(c / 100).toLocaleString()}` }

// --- Login ---

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  const [err, setErr] = React.useState('')
  const [load, setLoad] = React.useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoad(true); setErr('')
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw })
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error((d as any).error || 'Invalid credentials') }
      const d = await res.json()
      localStorage.setItem('vkrama_admin_token', d.token)
      window.location.href = '/admin'
    } catch (e: any) { setErr(e.message) } finally { setLoad(false) }
  }
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' } },
    React.createElement('form', { onSubmit: submit, style: { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: 360, maxWidth: '90%' } },
      React.createElement('h1', { style: { fontSize: 24, fontWeight: 700, marginBottom: 4, textAlign: 'center', margin: 0 } }, 'Vkrama Admin'),
      React.createElement('p', { style: { fontSize: 14, color: '#64748b', marginBottom: 24, textAlign: 'center' } }, 'Sign in'),
      err && React.createElement(Err, { msg: err }),
      React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Email'),
        React.createElement('input', { type: 'email', value: email, required: true, onChange: e => setEmail(e.target.value), style: inputS })
      ),
      React.createElement('div', { style: { marginBottom: 24 } },
        React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Password'),
        React.createElement('input', { type: 'password', value: pw, required: true, onChange: e => setPw(e.target.value), style: inputS })
      ),
      React.createElement('button', { type: 'submit', disabled: load, style: btnS(true, load) }, load ? 'Signing in...' : 'Sign In')
    )
  )
}

// --- Dashboard ---

function Dashboard() {
  const s = useAsync(() => api('/stats'), [])
  if (s.loading) return React.createElement(Spinner, null)
  if (s.error) return React.createElement(Err, { msg: s.error })
  const d = (s.data as any) || {}
  const cards = [
    { label: 'Revenue', value: cents(d.totalRevenueCents || 0), bg: '#f0fdf4' },
    { label: 'Orders', value: String(d.totalOrders || 0), bg: '#eef2ff' },
    { label: 'Customers', value: String(d.totalCustomers || 0), bg: '#fefce8' },
    { label: 'Products', value: String(d.totalProducts || 0), bg: '#eff6ff' },
  ]
  return React.createElement('div', null,
    React.createElement(PageHd, { title: 'Dashboard' }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 } },
      cards.map(c => React.createElement(Card, { key: c.label, style: { background: c.bg } },
        React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: '#0f172a' } }, c.value),
        React.createElement('div', { style: { fontSize: 14, color: '#64748b', marginTop: 4 } }, c.label)
      ))
    )
  )
}

// --- Products ---

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = React.useState(false)
  const [err, setErr] = React.useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API}/upload`, {
        method: 'POST', headers: authHeaders() as Record<string, string>,
        body: fd,
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error((d as any).error || 'Upload failed') }
      const d = await res.json()
      onChange(d.url)
    } catch (e: any) { setErr(e.message) } finally { setUploading(false) }
  }

  return React.createElement('div', null,
    React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Image'),
    React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'center' } },
      value && React.createElement('img', { src: value, style: { width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' } }),
      React.createElement('label', {
        style: {
          padding: '10px 20px', background: uploading ? '#e2e8f0' : '#f1f5f9',
          border: '2px dashed #d1d5db', borderRadius: 6, cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: 13, color: '#64748b'
        }
      },
        uploading ? 'Uploading...' : (value ? 'Replace' : 'Upload Image'),
        React.createElement('input', { type: 'file', accept: 'image/jpeg,image/png,image/gif,image/webp', onChange: handleFile, disabled: uploading, style: { display: 'none' } })
      ),
      value && React.createElement('button', {
        onClick: () => onChange(''),
        style: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit' }
      }, 'Remove')
    ),
    err && React.createElement('div', { style: { color: '#dc2626', fontSize: 12, marginTop: 4 } }, err)
  )
}

function ProductsList() {
  const [q, setQ] = React.useState('')
  const [sf, setSf] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/products'), [])
  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(Err, { msg: error })
  let list = (data as any[]) || []
  if (q) list = list.filter((p: any) => p.name?.toLowerCase().includes(q.toLowerCase()))
  if (sf) list = list.filter((p: any) => p.status === sf)
  const statusBadge = (s: string) =>
    React.createElement('span', {
      style: {
        padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, display: 'inline-block',
        background: s === 'active' ? '#dcfce7' : s === 'draft' ? '#fef9c3' : '#f1f5f9',
        color: s === 'active' ? '#16a34a' : s === 'draft' ? '#ca8a04' : '#64748b'
      }
    }, s || 'draft')

  return React.createElement('div', null,
    React.createElement(PageHd, {
      title: 'Products',
      action: React.createElement('a', { href: '/admin/products/new', style: btnS() }, '+ New Product')
    }),
    React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' } },
      React.createElement('input', { placeholder: 'Search...', value: q, onChange: e => setQ(e.target.value), style: { ...inputS, width: 240 } }),
      React.createElement('select', { value: sf, onChange: e => setSf(e.target.value), style: { ...inputS, width: 130 } },
        React.createElement('option', { value: '' }, 'All'),
        ['active', 'draft', 'archived'].map(s => React.createElement('option', { key: s, value: s }, s))
      )
    ),
    React.createElement(Card, null,
      list.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No products')
        : React.createElement(Table, {
          headers: ['Name', 'Price', 'Stock', 'Status', ''],
          rows: list.map((p: any) => [
            React.createElement('a', { href: `/admin/products/${p.id}`, style: { color: '#2563eb', textDecoration: 'none', fontWeight: 500 } }, p.name || '-'),
            cents(p.price_cents || 0),
            String(p.stock ?? 0),
            statusBadge(p.status),
            React.createElement('a', { href: `/admin/products/${p.id}`, style: { color: '#2563eb', textDecoration: 'none', fontSize: 13 } }, 'Edit')
          ])
        })
    )
  )
}

function ProductForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({
    name: '', description: '', price: '', compareAtPrice: '', cost: '',
    stock: '', imageUrl: '', status: 'draft'
  })
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [ready, setReady] = React.useState(!isEdit)

  React.useEffect(() => {
    if (id) {
      api(`/products/${id}`).then((d: any) => {
        setForm({
          name: d.name || '', description: d.description || '',
          price: d.price_cents ? (d.price_cents / 100).toFixed(0) : '',
          compareAtPrice: d.compare_at_price_cents ? (d.compare_at_price_cents / 100).toFixed(0) : '',
          cost: d.cost_cents ? (d.cost_cents / 100).toFixed(0) : '',
          stock: d.stock ?? '', imageUrl: d.image_url || '', status: d.status || 'draft'
        })
        setReady(true)
      }).catch(e => setError(e.message))
    }
  }, [id])

  const set = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const body = {
        name: form.name, description: form.description,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        stock: Number(form.stock) || 0, status: form.status,
        imageUrl: form.imageUrl || null,
      }
      if (isEdit) await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      else await api('/products', { method: 'POST', body: JSON.stringify(body) })
      window.location.href = '/admin/products'
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }

  if (!ready) return React.createElement(Spinner, null)

  const fields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Price (Rs.)', name: 'price', type: 'number' },
    { label: 'Compare At Price (Rs.)', name: 'compareAtPrice', type: 'number' },
    { label: 'Stock', name: 'stock', type: 'number' },
  ]

  return React.createElement('div', null,
    React.createElement(PageHd, { title: isEdit ? 'Edit Product' : 'New Product' }),
    error && React.createElement(Err, { msg: error }),
    React.createElement(Card, null,
      React.createElement('form', { onSubmit: submit, style: { maxWidth: 600 } },
        fields.map(f =>
          React.createElement('div', { key: f.name, style: { marginBottom: 16 } },
            React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, f.label),
            f.type === 'textarea'
              ? React.createElement('textarea', { value: form[f.name], onChange: set(f.name), rows: 4, style: { ...inputS, resize: 'vertical' } } as any)
              : React.createElement('input', { type: f.type, value: form[f.name], onChange: set(f.name), style: inputS })
          )
        ),
        React.createElement('div', { style: { marginBottom: 16 } },
          React.createElement(ImageUpload, { value: form.imageUrl, onChange: (url: string) => setForm({ ...form, imageUrl: url }) })
        ),
        React.createElement('div', { style: { marginBottom: 16 } },
          React.createElement('label', { style: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' } }, 'Status'),
          React.createElement('select', { value: form.status, onChange: set('status'), style: inputS },
            ['draft', 'active', 'archived'].map(s => React.createElement('option', { key: s, value: s }, s))
          )
        ),
        React.createElement('div', { style: { display: 'flex', gap: 12, marginTop: 24 } },
          React.createElement('button', { type: 'submit', disabled: saving, style: btnS(true, saving) }, saving ? 'Saving...' : 'Save'),
          React.createElement('a', { href: '/admin/products', style: btnS(false) }, 'Cancel')
        )
      )
    )
  )
}

// --- Orders ---

function OrdersList() {
  const [q, setQ] = React.useState('')
  const [sf, setSf] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/orders'), [])
  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(Err, { msg: error })
  let list = (data as any[]) || []
  if (q) list = list.filter((o: any) => o.email?.toLowerCase().includes(q.toLowerCase()))
  if (sf) list = list.filter((o: any) => o.status === sf)

  const sc: Record<string, string> = {
    pending: '#f59e0b', paid: '#3b82f6', processing: '#8b5cf6',
    shipped: '#3b82f6', delivered: '#10b981', cancelled: '#ef4444', refunded: '#64748b'
  }

  return React.createElement('div', null,
    React.createElement(PageHd, { title: 'Orders' }),
    React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' } },
      React.createElement('input', { placeholder: 'Search email...', value: q, onChange: e => setQ(e.target.value), style: { ...inputS, width: 240 } }),
      React.createElement('select', { value: sf, onChange: e => setSf(e.target.value), style: { ...inputS, width: 140 } },
        React.createElement('option', { value: '' }, 'All'),
        ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s =>
          React.createElement('option', { key: s, value: s }, s.charAt(0).toUpperCase() + s.slice(1))
        )
      )
    ),
    React.createElement(Card, null,
      list.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No orders')
        : React.createElement(Table, {
          headers: ['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''],
          rows: list.map((o: any) => [
            React.createElement('span', { style: { fontFamily: 'monospace', fontSize: 12, color: '#64748b' } }, o.id?.slice(0, 8) || '-'),
            o.email || '-',
            cents(o.total_cents || 0),
            o.payment_method || '-',
            React.createElement('span', { style: { padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#fff', background: sc[o.status] || '#64748b' } }, o.status || 'pending'),
            o.created_at ? new Date(o.created_at).toLocaleDateString() : '-',
            React.createElement('a', { href: `/admin/orders/${o.id}`, style: { color: '#2563eb', textDecoration: 'none', fontSize: 13 } }, 'View')
          ])
        })
    )
  )
}

function OrderShow() {
  const id = window.location.pathname.split('/').pop()
  const [updating, setUpdating] = React.useState(false)
  const [msg, setMsg] = React.useState('')
  const { data, loading, error, refetch } = useAsync(() => api(`/orders/${id}`), [id])
  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(Err, { msg: error })
  const o = data as any
  if (!o) return React.createElement(Err, { msg: 'Not found' })

  const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

  const changeStatus = async (status: string) => {
    setUpdating(true); setMsg('')
    try {
      await api(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })
      setMsg('Status updated')
      setTimeout(() => window.location.reload(), 1000)
    } catch (e: any) { setMsg(e.message) } finally { setUpdating(false) }
  }

  const fields = [
    { label: 'Order ID', value: o.id },
    { label: 'Customer', value: o.email },
    { label: 'Phone', value: o.phone },
    { label: 'Total', value: cents(o.total_cents || 0) },
    { label: 'Payment Method', value: o.payment_method },
    { label: 'Shipping', value: [o.shipping_name, o.shipping_line1, o.shipping_city, o.shipping_state].filter(Boolean).join(', ') },
    { label: 'Date', value: o.created_at ? new Date(o.created_at).toLocaleString() : '-' },
  ]

  return React.createElement('div', null,
    React.createElement(PageHd, {
      title: `Order #${(o.id || '').slice(0, 8)}`,
      action: React.createElement('a', { href: '/admin/orders', style: { ...btnS(false), fontSize: 13 } }, '← Orders')
    }),
    msg && React.createElement(Err, { msg }),
    React.createElement('div', { style: { display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' } },
      React.createElement(Card, null,
        React.createElement('h3', { style: { fontSize: 16, fontWeight: 600, margin: '0 0 16px', color: '#0f172a' } }, 'Order Details'),
        fields.map(f =>
          React.createElement('div', { key: f.label, style: { display: 'flex', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 } },
            React.createElement('div', { style: { width: 130, color: '#64748b', fontWeight: 500, flexShrink: 0 } }, f.label),
            React.createElement('div', { style: { color: '#0f172a' } }, f.value || '-')
          )
        )
      ),
      React.createElement(Card, null,
        React.createElement('h3', { style: { fontSize: 16, fontWeight: 600, margin: '0 0 16px', color: '#0f172a' } }, 'Status'),
        React.createElement('div', { style: { fontSize: 14, color: '#64748b', marginBottom: 8 } }, 'Current: ', React.createElement('strong', { style: { color: '#0f172a' } }, o.status)),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 } },
          statuses.map(s =>
            React.createElement('button', {
              key: s, onClick: () => changeStatus(s), disabled: updating || s === o.status,
              style: {
                padding: '8px 16px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: (updating || s === o.status) ? 'not-allowed' : 'pointer',
                background: s === o.status ? '#e2e8f0' : '#2563eb', color: s === o.status ? '#64748b' : '#fff'
              }
            }, s.charAt(0).toUpperCase() + s.slice(1))
          )
        )
      ),
      React.createElement(Card, { style: { gridColumn: '1 / -1' } },
        React.createElement('h3', { style: { fontSize: 16, fontWeight: 600, margin: '0 0 16px', color: '#0f172a' } }, 'Items'),
        (o.items || []).length === 0
          ? React.createElement('div', { style: { color: '#94a3b8' } }, 'No items')
          : React.createElement(Table, {
            headers: ['Product', 'Variant', 'Qty', 'Price', 'Total'],
            rows: (o.items || []).map((item: any) => [
              item.name || '-',
              item.variant_name || '-',
              String(item.quantity || 0),
              cents(item.price_cents || 0),
              cents((item.price_cents || 0) * (item.quantity || 1))
            ])
          })
      )
    )
  )
}

// --- Customers ---

function CustomersList() {
  const [q, setQ] = React.useState('')
  const { data, loading, error } = useAsync(() => api('/customers'), [])
  if (loading) return React.createElement(Spinner, null)
  if (error) return React.createElement(Err, { msg: error })
  let list = (data as any[]) || []
  if (q) list = list.filter((c: any) => c.email?.toLowerCase().includes(q.toLowerCase()))
  return React.createElement('div', null,
    React.createElement(PageHd, { title: 'Customers' }),
    React.createElement('input', { placeholder: 'Search email...', value: q, onChange: e => setQ(e.target.value), style: { ...inputS, width: 240, marginBottom: 20 } }),
    React.createElement(Card, null,
      list.length === 0
        ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: '#94a3b8' } }, 'No customers')
        : React.createElement(Table, {
          headers: ['Email', 'Name', 'Phone', 'Registered'],
          rows: list.map((c: any) => [
            c.email || '-', c.name || '-', c.phone || '-',
            c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'
          ])
        })
    )
  )
}

// --- Router ---

function matchRoute(path: string) {
  const p = path.split('/').filter(Boolean)
  if (path === '/admin' || path === '/admin/') return { page: 'dashboard' }
  if (path === '/admin/login') return { page: 'login' }
  if (p[1] === 'products' && p[2] === 'new') return { page: 'product-new' }
  if (p[1] === 'products' && p[2]) return { page: 'product-edit', params: { id: p[2] } }
  if (p[1] === 'products') return { page: 'products' }
  if (p[1] === 'orders' && p[2]) return { page: 'order-show', params: { id: p[2] } }
  if (p[1] === 'orders') return { page: 'orders' }
  if (p[1] === 'customers') return { page: 'customers' }
  return { page: 'dashboard' }
}

export default function AdminApp() {
  const [path, setPath] = React.useState(window.location.pathname)
  React.useEffect(() => {
    const h = () => setPath(window.location.pathname)
    window.addEventListener('popstate', h)
    return () => window.removeEventListener('popstate', h)
  }, [])

  const route = matchRoute(path)
  const token = localStorage.getItem('vkrama_admin_token')
  if (!token && route.page !== 'login') { window.location.href = '/admin/login'; return null }
  if (route.page === 'login') return React.createElement(LoginPage, null)

  let content: React.ReactNode
  switch (route.page) {
    case 'dashboard': content = React.createElement(Dashboard, null); break
    case 'products': content = React.createElement(ProductsList, null); break
    case 'product-new': content = React.createElement(ProductForm, null); break
    case 'product-edit': content = React.createElement(ProductForm, { id: (route.params as any).id }); break
    case 'orders': content = React.createElement(OrdersList, null); break
    case 'order-show': content = React.createElement(OrderShow, null); break
    case 'customers': content = React.createElement(CustomersList, null); break
    default: content = React.createElement(Dashboard, null)
  }
  return React.createElement(Layout, null, content)
}
