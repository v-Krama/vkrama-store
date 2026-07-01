import React from "react"

const API = "/api/admin"
const COLORS: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  slate: "bg-slate-100 text-slate-600",
}

function authHeaders(token?: string) {
  const t = token || localStorage.getItem("vkrama_admin_token")
  return t ? { Authorization: `Bearer ${t}` } : {}
}

async function api(path: string, options?: RequestInit) {
  const headers: Record<string, string> = authHeaders() as Record<string, string>
  if (options?.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json"
  const res = await fetch(`${API}${path}`, { headers, ...options })
  if (res.status === 401) { localStorage.removeItem("vkrama_admin_token"); window.location.href = "/admin/login"; throw new Error("Unauthorized") }
  if (!res.ok) { const err = await res.json().catch(() => ({ error: "Request failed" })); throw new Error(err.error || "Request failed") }
  return res.json()
}

function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  React.useEffect(() => { setLoading(true); setError(""); fn().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)) }, deps)
  return { data, loading, error }
}

function cents(c: number) { return `Rs. ${(c / 100).toLocaleString()}` }

// ---------- Shared Components ----------
function Spinner() { return <div className="text-center text-slate-500 py-10">Loading...</div> }
function Err({ msg }: { msg: string }) { return <div className="p-3.5 bg-red-50 text-red-600 rounded-lg mb-4 text-sm">{msg}</div> }
function PageHd({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-slate-900 m-0">{title}</h1>{action || null}</div>
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>{children}</div>
}
function Btn({ primary = true, disabled = false, className = "", children, ...props }: any) {
  return <button disabled={disabled} className={`px-5 py-2.5 rounded-lg text-sm font-semibold font-sans inline-block no-underline border transition-all ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${primary ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"} ${className}`} {...props}>{children}</button>
}
function Badge({ children, color = "slate" }: { children: React.ReactNode; color?: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-block ${COLORS[color] || COLORS.slate}`}>{children}</span>
}
function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-sm">
    <thead><tr>{headers.map(h => <th key={h} className="text-left px-4 py-3 border-b-2 border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">{h}</th>)}</tr></thead>
    <tbody>{rows.map((row, i) => <tr key={i} className={`border-b border-slate-100 ${i % 2 ? "bg-slate-50" : "bg-white"}`}>{row.map((cell, j) => <td key={j} className="px-4 py-3 text-slate-700">{cell}</td>)}</tr>)}</tbody>
  </table></div>
}
function Input({ className = "", ...props }: any) {
  return <input className={`w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans box-border ${className}`} {...props} />
}
function Select({ options, className = "", ...props }: any) {
  return <select className={`w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans box-border bg-white ${className}`} {...props}>{options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
}
function TextArea({ className = "", ...props }: any) {
  return <textarea className={`w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans box-border resize-vertical ${className}`} {...props} />
}
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-slate-700">{label}</span></label>
}

// ---------- Sidebar ----------
const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🛒" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/coupons", label: "Coupons", icon: "🏷️" },
  { href: "/admin/collections", label: "Collections", icon: "📁" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/menus", label: "Menus", icon: "🔗" },
  { href: "/admin/inventory", label: "Inventory", icon: "📋" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
]

function Sidebar() {
  const cur = window.location.pathname
  return <aside className="w-60 bg-slate-800 text-white flex flex-col shrink-0">
    <div className="p-5 text-lg font-bold border-b border-slate-700">Vkrama Admin</div>
    <nav className="p-2.5 flex-1 overflow-y-auto">
      {SIDEBAR_LINKS.map(l => <a key={l.href} href={l.href} className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm mb-0.5 no-underline transition-colors ${cur === l.href ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}><span>{l.icon}</span><span>{l.label}</span></a>)}
    </nav>
    <div className="p-3.5 border-t border-slate-700">
      <button onClick={() => { localStorage.removeItem("vkrama_admin_token"); window.location.href = "/admin/login" }} className="bg-transparent border-none text-slate-400 cursor-pointer text-xs p-0 font-sans hover:text-white transition-colors">Sign Out</button>
    </div>
  </aside>
}

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen font-sans"><Sidebar /><main className="flex-1 bg-slate-50 overflow-auto p-8">{children}</main></div>
}

// ---------- Login ----------
function LoginPage() {
  const [email, setEmail] = React.useState(""); const [pw, setPw] = React.useState(""); const [err, setErr] = React.useState(""); const [load, setLoad] = React.useState(false)
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoad(true); setErr(""); try { const res = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: pw }) }); if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Invalid credentials") }; const d = await res.json(); localStorage.setItem("vkrama_admin_token", d.token); window.location.href = "/admin" } catch (e: any) { setErr(e.message) } finally { setLoad(false) } }
  return <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans"><form onSubmit={submit} className="bg-white p-10 rounded-xl shadow-md w-96 max-w-[90%]"><h1 className="text-2xl font-bold text-center mb-1">Vkrama Admin</h1><p className="text-sm text-slate-500 text-center mb-6">Sign in to your account</p>{err && <Err msg={err} />}<div className="mb-4"><label className="block text-sm font-medium mb-1.5 text-slate-700">Email</label><Input type="email" value={email} required onChange={e => setEmail(e.target.value)} /></div><div className="mb-6"><label className="block text-sm font-medium mb-1.5 text-slate-700">Password</label><Input type="password" value={pw} required onChange={e => setPw(e.target.value)} /></div><Btn type="submit" disabled={load} className="w-full text-center justify-center">{load ? "Signing in..." : "Sign In"}</Btn></form></div>
}

// ---------- Dashboard ----------
function Dashboard() {
  const s = useAsync(() => api("/stats"), [])
  if (s.loading) return <Spinner />
  if (s.error) return <Err msg={s.error} />
  const d = (s.data as any) || {}
  const cards = [
    { label: "Revenue", value: cents(d.totalRevenueCents || 0), bg: "bg-green-50" },
    { label: "Orders", value: String(d.totalOrders || 0), bg: "bg-indigo-50" },
    { label: "Customers", value: String(d.totalCustomers || 0), bg: "bg-yellow-50" },
    { label: "Products", value: String(d.totalProducts || 0), bg: "bg-blue-50" },
    { label: "Reviews", value: String(d.totalReviews || 0), bg: "bg-purple-50" },
    { label: "Coupons", value: String(d.totalCoupons || 0), bg: "bg-pink-50" },
  ]
  return <div><PageHd title="Dashboard" /><div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">{cards.map(c => <Card key={c.label} className={c.bg}><div className="text-3xl font-bold text-slate-900">{c.value}</div><div className="text-sm text-slate-500 mt-1">{c.label}</div></Card>)}</div></div>
}

// ---------- Image Upload ----------
function ImageUpload({ value, onChange, hideLabel }: { value: string; onChange: (url: string) => void; hideLabel?: boolean }) {
  const [uploading, setUploading] = React.useState(false); const [err, setErr] = React.useState("")
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true); setErr("")
    try { const fd = new FormData(); fd.append("file", file); const res = await fetch(`${API}/upload`, { method: "POST", headers: authHeaders() as Record<string, string>, body: fd }); if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Upload failed") }; const d = await res.json(); onChange(d.url) } catch (e: any) { setErr(e.message) } finally { setUploading(false) }
  }
  return <div>{!hideLabel && <label className="block text-sm font-medium mb-1.5 text-slate-700">Image</label>}<div className="flex gap-3 items-center">{value && <img src={value} className="w-20 h-20 rounded-lg object-cover border border-slate-200" />}<label className={`px-5 py-2.5 rounded-md border-2 border-dashed border-slate-300 text-sm text-slate-500 cursor-pointer ${uploading ? "bg-slate-100 cursor-not-allowed" : "bg-slate-50 hover:bg-slate-100"}`}>{uploading ? "Uploading..." : value ? "Replace" : "Upload"}<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFile} disabled={uploading} className="hidden" /></label>{value && <button onClick={() => onChange("")} className="bg-transparent border-none text-red-600 cursor-pointer text-xs font-sans hover:underline p-0">Remove</button>}</div>{err && <div className="text-red-600 text-xs mt-1">{err}</div>}</div>
}

// ---------- Products ----------
function ProductsList() {
  const [q, setQ] = React.useState(""); const [sf, setSf] = React.useState("")
  const { data, loading, error } = useAsync(() => api("/products"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  let list = (data as any[]) || []
  if (q) list = list.filter((p: any) => p.name?.toLowerCase().includes(q.toLowerCase()))
  if (sf) list = list.filter((p: any) => p.status === sf)
  const statusColor = (s: string) => s === "active" ? "green" : s === "draft" ? "yellow" : "slate"
  return (
    <div>
      <PageHd title="Products" action={<a href="/admin/products/new" className="btn-primary">+ New Product</a>} />
      <div className="flex gap-3 mb-5 flex-wrap">
        <Input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} className="!w-60" />
        <select value={sf} onChange={e => setSf(e.target.value)} className="w-32 px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No products</div>
          : <DataTable headers={["Name", "Price", "Stock", "Status", "Variants", ""]}
              rows={list.map((p: any) => [
                <a href={`/admin/products/${p.id}`} className="text-blue-600 no-underline font-medium">{p.name || "-"}</a>,
                cents(p.minPrice || 0),
                String(p.totalStock ?? 0),
                <Badge color={statusColor(p.status)}>{p.status || "draft"}</Badge>,
                String(p.variantCount || 0),
                <a href={`/admin/products/${p.id}`} className="text-blue-600 no-underline text-xs">Edit</a>
              ])}
            />
        }
      </Card>
    </div>
  )
}

function ProductForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({ name: "", description: "", brand: "", tags: "", status: "draft", sortOrder: 0, isFeatured: false, isPhysical: true, gtin: "", hsCode: "", originCountry: "", seoTitle: "", seoDescription: "", weight: "", weightUnit: "kg", minOrderQty: 1, maxOrderQty: "", prebookingStatus: "none", prebookingReleaseDate: "" })
  const [variants, setVariants] = React.useState<any[]>([{ name: "Default", sku: "", priceCents: "", compareAtPriceCents: "", costCents: "", stock: "", imageUrls: [""] }])
  const [saving, setSaving] = React.useState(false); const [error, setError] = React.useState(""); const [ready, setReady] = React.useState(!isEdit); const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [allCategories, setAllCategories] = React.useState<any[]>([]); const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([])
  React.useEffect(() => { api("/categories").then(setAllCategories).catch(() => {}) }, [])
  React.useEffect(() => { if (id) { api(`/products/${id}`).then((d: any) => { setForm({ name: d.name || "", description: d.description || "", brand: d.brand || "", tags: (d.tags || []).join(", "), status: d.status || "draft", sortOrder: d.sortOrder || 0, isFeatured: !!d.isFeatured, isPhysical: d.isPhysical !== false, gtin: d.gtin || "", hsCode: d.hsCode || "", originCountry: d.originCountry || "", seoTitle: d.seoTitle || "", seoDescription: d.seoDescription || "", weight: d.weight ?? "", weightUnit: d.weightUnit || "kg", minOrderQty: d.minOrderQty || 1, maxOrderQty: d.maxOrderQty ?? "", prebookingStatus: d.prebookingStatus || "none", prebookingReleaseDate: d.prebookingReleaseDate || "" }); if (d.variants?.length) setVariants(d.variants.map(parseImageUrlForVariant)); if (d.categoryIds) setSelectedCategoryIds(d.categoryIds); setReady(true) }).catch(e => setError(e.message)) } }, [id])
  const set = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value })
  const setVariant = (i: number, f: string) => (e: any) => { const v = [...variants]; v[i] = { ...v[i], [f]: e.target.value }; setVariants(v) }
  const addVariant = () => setVariants([...variants, { name: "", sku: "", priceCents: "", compareAtPriceCents: "", costCents: "", stock: "", imageUrls: [""] }])
  const removeVariant = (i: number) => { if (variants.length > 1) setVariants(variants.filter((_, idx) => idx !== i)) }
  const setVariantImageUrl = (i: number, imgIdx: number, url: string) => { const v = [...variants]; v[i].imageUrls[imgIdx] = url; setVariants(v) }
  const addVariantImage = (i: number) => { const v = [...variants]; v[i].imageUrls.push(""); setVariants(v) }
  const removeVariantImage = (i: number, imgIdx: number) => { const v = [...variants]; v[i].imageUrls.splice(imgIdx, 1); if (!v[i].imageUrls.length) v[i].imageUrls.push(""); setVariants(v) }
  const parseImageUrlForVariant = (v: any) => { let imgUrls: string[]; try { const p = JSON.parse(v.imageUrl); imgUrls = Array.isArray(p) ? p.filter(Boolean) : [v.imageUrl] } catch(e) { imgUrls = v.imageUrl ? [v.imageUrl] : [""] }; return { ...v, imageUrls: imgUrls.length ? imgUrls : [""], priceCents: v.priceCents ?? "", compareAtPriceCents: v.compareAtPriceCents ?? "", costCents: v.costCents ?? "", stock: v.stock ?? "" } }
  const toggleCategory = (catId: string) => { setSelectedCategoryIds(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]) }
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); try { const body = { ...form, categoryIds: selectedCategoryIds, tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [], variants: variants.map(v => { const imgs = v.imageUrls.filter(Boolean); return { ...v, imageUrl: imgs[0] || '', imageUrls: imgs, priceCents: Number(v.priceCents) || 0, compareAtPriceCents: v.compareAtPriceCents ? Number(v.compareAtPriceCents) : null, costCents: v.costCents ? Number(v.costCents) : null, stock: Number(v.stock) || 0 } }), weight: form.weight ? Number(form.weight) : null, minOrderQty: Math.max(1, Number(form.minOrderQty) || 1), maxOrderQty: form.maxOrderQty ? Math.max(1, Number(form.maxOrderQty)) : null, sortOrder: Math.max(0, Number(form.sortOrder) || 0) }; if (isEdit) await api(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }); else await api("/products", { method: "POST", body: JSON.stringify(body) }); window.location.href = "/admin/products" } catch (e: any) { setError(e.message) } finally { setSaving(false) } }
  const handleDelete = async () => { if (!confirmDelete) { setConfirmDelete(true); return }; setSaving(true); try { await api(`/products/${id}`, { method: "DELETE" }); window.location.href = "/admin/products" } catch (e: any) { setError(e.message); setConfirmDelete(false) } finally { setSaving(false) } }
  if (!ready) return <Spinner />
  return <div><PageHd title={isEdit ? "Edit Product" : "New Product"} />{error && <Err msg={error} />}<Card><form onSubmit={submit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Name</label><Input value={form.name} onChange={set("name")} required /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Brand</label><Input value={form.brand} onChange={set("brand")} /></div></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Description</label><TextArea value={form.description} onChange={set("description")} rows={3} /></div><div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Status</label><Select value={form.status} onChange={set("status")} options={[{ value: "draft", label: "Draft" }, { value: "active", label: "Active" }, { value: "archived", label: "Archived" }]} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Sort Order</label><Input type="number" value={form.sortOrder} onChange={set("sortOrder")} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Tags (comma separated)</label><Input value={form.tags} onChange={set("tags")} /></div></div><div className="grid grid-cols-2 gap-4"><Toggle value={form.isFeatured} onChange={v => setForm({ ...form, isFeatured: v })} label="Featured Product" /><Toggle value={form.isPhysical} onChange={v => setForm({ ...form, isPhysical: v })} label="Physical Product" /></div><div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium mb-1.5 text-slate-700">GTIN</label><Input value={form.gtin} onChange={set("gtin")} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">HS Code</label><Input value={form.hsCode} onChange={set("hsCode")} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Origin Country</label><Input value={form.originCountry} onChange={set("originCountry")} /></div></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Categories</label><div className="flex flex-wrap gap-3 mt-1">{allCategories.map(cat => (<label key={cat.id} className="inline-flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" checked={selectedCategoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="rounded border-slate-300" />{cat.name}</label>))}</div></div><div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Weight</label><Input type="number" value={form.weight} onChange={set("weight")} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Weight Unit</label><Select value={form.weightUnit} onChange={set("weightUnit")} options={[{ value: "kg", label: "kg" }, { value: "g", label: "g" }, { value: "lb", label: "lb" }]} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Min Order Qty</label><Input type="number" value={form.minOrderQty} onChange={set("minOrderQty")} /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5 text-slate-700">Prebooking Status</label><Select value={form.prebookingStatus} onChange={set("prebookingStatus")} options={[{ value: "none", label: "None" }, { value: "prebooking", label: "Prebooking" }, { value: "scheduled", label: "Scheduled" }]} /></div>{form.prebookingStatus !== "none" && <div><label className="block text-sm font-medium mb-1.5 text-slate-700">Release Date</label><Input type="date" value={form.prebookingReleaseDate} onChange={set("prebookingReleaseDate")} /></div>}</div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5 text-slate-700">SEO Title</label><Input value={form.seoTitle} onChange={set("seoTitle")} /></div><div><label className="block text-sm font-medium mb-1.5 text-slate-700">SEO Description</label><Input value={form.seoDescription} onChange={set("seoDescription")} /></div></div><div className="border-t pt-4"><h3 className="text-base font-semibold mb-3">Variants</h3>{variants.map((v, i) => <div key={i} className="p-3 bg-slate-50 rounded-lg mb-2"><div className="grid grid-cols-4 gap-2 items-end"><div><label className="block text-xs font-medium mb-1 text-slate-600">Name</label><Input value={v.name} onChange={setVariant(i, "name")} /></div><div><label className="block text-xs font-medium mb-1 text-slate-600">SKU</label><Input value={v.sku} onChange={setVariant(i, "sku")} /></div><div><label className="block text-xs font-medium mb-1 text-slate-600">Price (cents)</label><Input type="number" value={v.priceCents} onChange={setVariant(i, "priceCents")} /></div><div className="flex gap-2 items-end"><div className="flex-1"><label className="block text-xs font-medium mb-1 text-slate-600">Stock</label><Input type="number" value={v.stock} onChange={setVariant(i, "stock")} /></div>                    {variants.length > 1 && <button type="button" onClick={() => removeVariant(i)} className="px-2 py-2.5 text-red-600 text-xs hover:bg-red-50 rounded border border-red-200">✕</button>}</div></div><div className="grid grid-cols-3 gap-2 mt-2"><Input placeholder="Compare at" type="number" value={v.compareAtPriceCents} onChange={setVariant(i, "compareAtPriceCents")} /><Input placeholder="Cost" type="number" value={v.costCents} onChange={setVariant(i, "costCents")} /></div><div className="mt-2"><label className="block text-sm font-medium mb-1.5 text-slate-700">Images</label><div className="flex flex-wrap gap-3">{(v.imageUrls || []).map((url: string, imgIdx: number) => (<div key={imgIdx} className="relative"><ImageUpload value={url} onChange={(newUrl) => setVariantImageUrl(i, imgIdx, newUrl)} hideLabel />{(v.imageUrls || []).length > 1 && <button type="button" onClick={() => removeVariantImage(i, imgIdx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600">x</button>}</div>))}</div><button type="button" onClick={() => addVariantImage(i)} className="mt-2 text-sm text-brand-600 hover:underline">+ Add Image</button></div></div>)}<Btn type="button" primary={false} onClick={addVariant}>+ Add Variant</Btn></div><div className="flex gap-3 pt-4 justify-between"><div className="flex gap-3"><Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Btn><a href="/admin/products"><Btn type="button" primary={false}>Cancel</Btn></a></div>{isEdit && <button type="button" disabled={saving} onClick={handleDelete} className={`px-5 py-2.5 rounded-lg text-sm font-semibold font-sans border transition-all ${confirmDelete ? "bg-red-600 text-white border-red-600" : "bg-white text-red-600 border-red-200 hover:bg-red-50"} ${saving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>{confirmDelete ? "Confirm Delete?" : "Delete"}</button>}</div></form></Card></div>
}

// ---------- Orders ----------
function OrdersList() {
  const [q, setQ] = React.useState(""); const [sf, setSf] = React.useState(""); const { data, loading, error } = useAsync(() => api("/orders"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  let list = (data as any[]) || []; if (q) list = list.filter((o: any) => o.email?.toLowerCase().includes(q.toLowerCase()) || (o.order_number || "").toLowerCase().includes(q.toLowerCase())); if (sf) list = list.filter((o: any) => o.status === sf)
  const sc: Record<string, string> = { pending: "yellow", awaiting_payment: "yellow", payment_requested: "blue", paid: "green", confirmed: "blue", processing: "purple", shipped: "blue", delivered: "green", cancelled: "red", refunded: "slate", partially_refunded: "yellow" }
  const sl: Record<string, string> = { pending: "Pending", awaiting_payment: "Awaiting Payment", payment_requested: "Payment Requested", paid: "Paid", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded", partially_refunded: "Partial Refund" }
  const statusOpts = [{ value: "", label: "All" }, ...Object.keys(sc).map(s => ({ value: s, label: sl[s] || s.charAt(0).toUpperCase() + s.slice(1) }))]
  return (
    <div>
      <PageHd title="Orders" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <Input placeholder="Search email or order #..." value={q} onChange={e => setQ(e.target.value)} className="!w-60" />
        <select value={sf} onChange={e => setSf(e.target.value)} className="w-44 px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none">
          {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No orders</div>
          : <DataTable headers={["Order #", "Customer", "Total", "Payment", "Status", "Date", ""]}
              rows={list.map((o: any) => {
                const pmLabel = o.payment_method === "qr" ? "QR" : o.payment_method === "cash" ? "COD" : o.payment_method || "-"
                const pmColor = o.payment_status === "paid" ? "green" : "yellow"
                return [
                  <span className="font-mono text-xs text-slate-500">{o.order_number || (o.id || "").slice(0, 8)}</span>,
                  o.email || "-",
                  cents(o.total_cents || 0),
                  <span className="text-xs">{pmLabel} <span className={`${pmColor === "green" ? "text-green-500" : "text-yellow-500"}`}>({o.payment_status})</span></span>,
                  <Badge color={sc[o.status] || "slate"}>{sl[o.status] || o.status}</Badge>,
                  o.created_at ? new Date(o.created_at).toLocaleDateString() : "-",
                  <a href={`/admin/orders/${o.id}`} className="text-blue-600 no-underline text-xs">View</a>
                ]
              })}
            />
        }
      </Card>
    </div>
  )
}
function OrderShow() {
  const id = window.location.pathname.split("/").pop()
  const [updating, setUpdating] = React.useState(false); const [msg, setMsg] = React.useState(""); const [txId, setTxId] = React.useState(""); const { data, loading, error } = useAsync(() => api(`/orders/${id}`), [id])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />; const o = data as any; if (!o) return <Err msg="Not found" />
  const sc: Record<string, string> = { pending: "yellow", awaiting_payment: "yellow", payment_requested: "blue", paid: "green", confirmed: "blue", processing: "purple", shipped: "blue", delivered: "green", cancelled: "red", refunded: "slate", partially_refunded: "yellow" }
  const sl: Record<string, string> = { pending: "Pending", awaiting_payment: "Awaiting Payment", payment_requested: "Payment Requested", paid: "Paid", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded", partially_refunded: "Partially Refunded" }
  const isQrPayment = o.payment_method === "qr" || o.payment_method === "bank_transfer"
  const changeStatus = async (status: string) => { setUpdating(true); setMsg(""); try { await api(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) }); setMsg("Updated"); setTimeout(() => window.location.reload(), 1000) } catch (e: any) { setMsg(e.message) } finally { setUpdating(false) } }
  const requestPayment = async () => { setUpdating(true); setMsg(""); try { await api(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ action: "request_payment" }) }); setMsg("Payment request sent to customer"); setTimeout(() => window.location.reload(), 1500) } catch (e: any) { setMsg(e.message) } finally { setUpdating(false) } }
  const confirmPayment = async () => { if (!txId.trim()) { setMsg("Enter transaction reference"); return }; setUpdating(true); setMsg(""); try { await api(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ action: "confirm_payment", transactionId: txId }) }); setMsg("Payment confirmed"); setTimeout(() => window.location.reload(), 1500) } catch (e: any) { setMsg(e.message) } finally { setUpdating(false) } }
  const actionBtns = () => {
    if (o.status === "awaiting_payment" && isQrPayment) {
      return <button onClick={requestPayment} disabled={updating} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white border-none hover:bg-blue-700 cursor-pointer font-sans">Request Payment</button>
    }
    if (o.status === "payment_requested") {
      return <div className="flex gap-2 items-end"><div className="flex-1"><label className="block text-xs font-medium text-slate-500 mb-1">Transaction Reference</label><input value={txId} onChange={e => setTxId(e.target.value)} placeholder="Portal reference ID" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 font-sans box-border" /></div><button onClick={confirmPayment} disabled={updating} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white border-none hover:bg-green-700 cursor-pointer font-sans whitespace-nowrap">Confirm Payment</button></div>
    }
    return null
  }
  return (
    <div>
      <PageHd title={`Order #${o.order_number || (o.id || "").slice(0, 8)}`} action={<a href="/admin/orders" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-slate-700 border border-slate-300 no-underline inline-block hover:bg-slate-50">← Orders</a>} />
      {msg && <Err msg={msg} />}
      <div className="grid gap-6 grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold mb-4 text-slate-900">Details</h3>
          {[
            { label: "Order #", value: o.order_number },
            { label: "Email", value: o.email },
            { label: "Phone", value: o.phone },
            { label: "Subtotal", value: cents(o.subtotal_cents) },
            { label: "Shipping", value: cents(o.shipping_cents) },
            { label: "Tax", value: cents(o.tax_cents) },
            { label: "Discount", value: cents(o.discount_cents) },
            { label: "Total", value: cents(o.total_cents) },
            { label: "Payment Method", value: o.payment_method },
            { label: "Payment Status", value: o.payment_status },
            { label: "Shipping", value: [o.shipping_name, o.shipping_line1, o.shipping_city].filter(Boolean).join(", ") || "-" },
            { label: "Date", value: o.created_at ? new Date(o.created_at).toLocaleString() : "-" },
          ].map(f => (
            <div key={f.label} className="flex py-2 border-b border-slate-100 text-sm last:border-0">
              <div className="w-32 text-slate-500 font-medium shrink-0">{f.label}</div>
              <div className="text-slate-900">{f.value || "-"}</div>
            </div>
          ))}
          {o.notes && <div className="mt-3 pt-3 border-t border-slate-200"><div className="text-xs text-slate-400 mb-1">Customer Notes</div><div className="text-sm text-slate-700">{o.notes}</div></div>}
          {o.gift_note && <div className="mt-2"><div className="text-xs text-slate-400 mb-1">Gift Note</div><div className="text-sm text-slate-700 italic">{o.gift_note}</div></div>}
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-base font-semibold mb-4 text-slate-900">Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-500">Current:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-block ${sc[o.status] ? `bg-${sc[o.status]}-100 text-${sc[o.status]}-700` : "bg-slate-100 text-slate-600"}`}>{sl[o.status] || o.status}</span>
            </div>
            {actionBtns()}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Quick Status Change</div>
              <div className="flex flex-wrap gap-2">
                {["pending","confirmed","processing","shipped","delivered","cancelled","refunded"].map(s => (
                  <button key={s} onClick={() => changeStatus(s)} disabled={updating || s === o.status}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold font-sans border transition-all ${
                      s === o.status
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-200"
                        : updating
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >{sl[s] || s}</button>
                ))}
              </div>
            </div>
          </Card>

          {o.payments?.length > 0 && (
            <Card>
              <h3 className="text-base font-semibold mb-4 text-slate-900">Payments</h3>
              {o.payments.map((p: any) => (
                <div key={p.id} className="flex justify-between py-2 border-b border-slate-100 text-sm last:border-0">
                  <div>
                    <div className="text-slate-900 font-medium">{p.method}</div>
                    <div className="text-slate-400 text-xs">ID: {p.transaction_id || "-"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900">{cents(p.amount_cents)}</div>
                    <div className={`text-xs ${p.status === "succeeded" ? "text-green-600" : "text-yellow-600"}`}>{p.status}</div>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {o.statusHistory?.length > 0 && (
            <Card>
              <h3 className="text-base font-semibold mb-4 text-slate-900">Status History</h3>
              <div className="space-y-2">
                {o.statusHistory.map((h: any) => (
                  <div key={h.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-700">
                        {sl[h.from_status] || h.from_status || "—"} → <strong>{sl[h.to_status] || h.to_status}</strong>
                      </div>
                      <div className="text-slate-400 text-xs">{h.created_at ? new Date(h.created_at).toLocaleString() : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card className="mt-6">
        <h3 className="text-base font-semibold mb-4 text-slate-900">Order Items</h3>
        {(o.items || []).length === 0
          ? <div className="text-slate-400 text-sm">No items</div>
          : <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead><tr>
                  <th className="text-left px-3 py-2 border-b-2 border-slate-200 text-slate-500 font-semibold text-xs uppercase">Item</th>
                  <th className="text-left px-3 py-2 border-b-2 border-slate-200 text-slate-500 font-semibold text-xs uppercase">SKU</th>
                  <th className="text-right px-3 py-2 border-b-2 border-slate-200 text-slate-500 font-semibold text-xs uppercase">Price</th>
                  <th className="text-right px-3 py-2 border-b-2 border-slate-200 text-slate-500 font-semibold text-xs uppercase">Qty</th>
                  <th className="text-right px-3 py-2 border-b-2 border-slate-200 text-slate-500 font-semibold text-xs uppercase">Total</th>
                </tr></thead>
                <tbody>
                  {o.items.map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        {item.variant_name && <div className="text-slate-400 text-xs">{item.variant_name}</div>}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{item.sku || "-"}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{cents(item.price_cents)}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{item.quantity}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-900">{cents(item.price_cents * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </Card>
    </div>
  )
}

// ---------- Customers ----------
function CustomersList() {
  const [q, setQ] = React.useState(""); const { data, loading, error } = useAsync(() => api("/customers"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  let list = (data as any[]) || []; if (q) list = list.filter((c: any) => c.email?.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <PageHd title="Customers" />
      <Input placeholder="Search email..." value={q} onChange={e => setQ(e.target.value)} className="!w-60 mb-5" />
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No customers</div>
          : <DataTable headers={["Email", "Name", "Phone", "Registered", "Orders", "Verified"]}
              rows={list.map((c: any) => [
                c.email || "-",
                c.name || "-",
                c.phone || "-",
                c.created_at ? new Date(c.created_at).toLocaleDateString() : "-",
                String(c.order_count || 0),
                c.is_verified ? <Badge color="green">Yes</Badge> : <Badge color="yellow">No</Badge>
              ])}
            />
        }
      </Card>
    </div>
  )
}

// ---------- Coupons ----------
function CouponsList() {
  const { data, loading, error } = useAsync(() => api("/coupons"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  const list = (data as any[]) || []
  return (
    <div>
      <PageHd title="Coupons" action={<a href="/admin/coupons/new" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white no-underline inline-block hover:bg-blue-700">+ New Coupon</a>} />
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No coupons</div>
          : <DataTable headers={["Code", "Type", "Value", "Usage", "Min Order", "Active", "Expires", ""]}
              rows={list.map((c: any) => [
                <strong className="font-mono">{c.code}</strong>,
                c.type === "percent" ? "%" : "Fixed",
                c.type === "percent" ? `${c.value_percent}%` : cents(c.value_cents),
                `${c.used_count || 0}/${c.usage_limit || "∞"}`,
                c.min_order_cents ? cents(c.min_order_cents) : "-",
                c.is_active ? <Badge color="green">Yes</Badge> : <Badge color="red">No</Badge>,
                c.ends_at ? new Date(c.ends_at).toLocaleDateString() : "Never",
                <a href={`/admin/coupons/${c.id}`} className="text-blue-600 no-underline text-xs">Edit</a>
              ])}
            />
        }
      </Card>
    </div>
  )
}
function CouponForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({ code: "", type: "percent", valuePercent: "", valueCents: "", minOrderCents: "", maxDiscountCents: "", usageLimit: "", perCustomerLimit: 1, isActive: true, startsAt: "", endsAt: "", description: "" })
  const [saving, setSaving] = React.useState(false); const [error, setError] = React.useState(""); const [ready, setReady] = React.useState(!isEdit)
  React.useEffect(() => { if (id) { api(`/coupons/${id}`).then((d: any) => { setForm(d); setReady(true) }).catch(e => setError(e.message)) } }, [id])
  const set = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value })
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); try { const body = { ...form, valuePercent: Number(form.valuePercent) || 0, valueCents: Number(form.valueCents) || 0, minOrderCents: Number(form.minOrderCents) || 0, maxDiscountCents: Number(form.maxDiscountCents) || 0, usageLimit: Number(form.usageLimit) || 0, perCustomerLimit: Number(form.perCustomerLimit) || 1 }; if (isEdit) await api(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(body) }); else await api("/coupons", { method: "POST", body: JSON.stringify(body) }); window.location.href = "/admin/coupons" } catch (e: any) { setError(e.message) } finally { setSaving(false) } }
  if (!ready) return <Spinner />
  return <div><PageHd title={isEdit ? "Edit Coupon" : "New Coupon"} />{error && <Err msg={error} />}<Card><form onSubmit={submit} className="max-w-xl space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Code</label><Input value={form.code} onChange={set("code")} required /></div><div><label className="block text-sm font-medium mb-1.5">Type</label><Select value={form.type} onChange={set("type")} options={[{ value: "percent", label: "Percentage" }, { value: "fixed", label: "Fixed Amount" }]} /></div></div>{form.type === "percent" ? <div><label className="block text-sm font-medium mb-1.5">Discount %</label><Input type="number" value={form.valuePercent} onChange={set("valuePercent")} /></div> : <div><label className="block text-sm font-medium mb-1.5">Discount Amount (cents)</label><Input type="number" value={form.valueCents} onChange={set("valueCents")} /></div>}<div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Min Order (cents)</label><Input type="number" value={form.minOrderCents} onChange={set("minOrderCents")} /></div><div><label className="block text-sm font-medium mb-1.5">Max Discount (cents)</label><Input type="number" value={form.maxDiscountCents} onChange={set("maxDiscountCents")} /></div><div><label className="block text-sm font-medium mb-1.5">Usage Limit</label><Input type="number" value={form.usageLimit} onChange={set("usageLimit")} placeholder="0 = unlimited" /></div><div><label className="block text-sm font-medium mb-1.5">Per Customer Limit</label><Input type="number" value={form.perCustomerLimit} onChange={set("perCustomerLimit")} /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Starts At</label><Input type="datetime-local" value={form.startsAt} onChange={set("startsAt")} /></div><div><label className="block text-sm font-medium mb-1.5">Ends At</label><Input type="datetime-local" value={form.endsAt} onChange={set("endsAt")} /></div></div><div><label className="block text-sm font-medium mb-1.5">Description</label><TextArea value={form.description} onChange={set("description")} rows={2} /></div><Toggle value={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Active" /><div className="flex gap-3 pt-4"><Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Btn><a href="/admin/coupons"><Btn type="button" primary={false}>Cancel</Btn></a></div></form></Card></div>
}

// ---------- Collections ----------
function CollectionsList() {
  const { data, loading, error } = useAsync(() => api("/collections"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  const list = (data as any[]) || []
  return (
    <div>
      <PageHd title="Collections" action={<a href="/admin/collections/new" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white no-underline inline-block hover:bg-blue-700">+ New Collection</a>} />
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No collections</div>
          : <DataTable headers={["Name", "Slug", "Products", "Active", "Order", ""]}
              rows={list.map((c: any) => [
                <a href={`/admin/collections/${c.id}`} className="text-blue-600 no-underline font-medium">{c.name}</a>,
                c.slug,
                String(c.product_count || 0),
                c.is_active ? <Badge color="green">Yes</Badge> : <Badge color="red">No</Badge>,
                String(c.sort_order || 0),
                <a href={`/admin/collections/${c.id}`} className="text-blue-600 no-underline text-xs">Edit</a>
              ])}
            />
        }
      </Card>
    </div>
  )
}
function CollectionForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({ name: "", slug: "", description: "", imageUrl: "", isActive: true, sortOrder: 0 })
  const [saving, setSaving] = React.useState(false); const [error, setError] = React.useState(""); const [ready, setReady] = React.useState(!isEdit)
  React.useEffect(() => { if (id) { api(`/collections/${id}`).then((d: any) => { setForm(d); setReady(true) }).catch(e => setError(e.message)) } }, [id])
  const set = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value })
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); try { if (isEdit) await api(`/collections/${id}`, { method: "PUT", body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) || 0 }) }); else await api("/collections", { method: "POST", body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) || 0 }) }); window.location.href = "/admin/collections" } catch (e: any) { setError(e.message) } finally { setSaving(false) } }
  if (!ready) return <Spinner />
  return <div><PageHd title={isEdit ? "Edit Collection" : "New Collection"} />{error && <Err msg={error} />}<Card><form onSubmit={submit} className="max-w-xl space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Name</label><Input value={form.name} onChange={set("name")} required /></div><div><label className="block text-sm font-medium mb-1.5">Slug</label><Input value={form.slug} onChange={set("slug")} /></div></div><div><label className="block text-sm font-medium mb-1.5">Description</label><TextArea value={form.description} onChange={set("description")} rows={2} /></div><ImageUpload value={form.imageUrl} onChange={(url: string) => setForm({ ...form, imageUrl: url })} /><div className="grid grid-cols-2 gap-4"><Toggle value={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Active" /><div><label className="block text-sm font-medium mb-1.5">Sort Order</label><Input type="number" value={form.sortOrder} onChange={set("sortOrder")} /></div></div><div className="flex gap-3 pt-4"><Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Btn><a href="/admin/collections"><Btn type="button" primary={false}>Cancel</Btn></a></div></form></Card></div>
}

// ---------- Reviews ----------
function ReviewsList() {
  const [sf, setSf] = React.useState(""); const { data, loading, error } = useAsync(() => api("/reviews"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  let list = (data as any[]) || []; if (sf) list = list.filter((r: any) => sf === "approved" ? r.is_approved : !r.is_approved)
  const approve = async (id: string, approved: boolean) => { try { await api(`/reviews/${id}`, { method: "PUT", body: JSON.stringify({ isApproved: approved }) }); window.location.reload() } catch (e: any) { alert(e.message) } }
  const filterOpts = [{ value: "", label: "All" }, { value: "approved", label: "Approved" }, { value: "pending", label: "Pending" }]
  return (
    <div>
      <PageHd title="Reviews" />
      <div className="flex gap-3 mb-5">
        <select value={sf} onChange={e => setSf(e.target.value)} className="w-36 px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none">
          {filterOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No reviews</div>
          : <DataTable headers={["Product", "Customer", "Rating", "Review", "Verified", "Status", ""]}
              rows={list.map((r: any) => [
                r.product_name || "-",
                r.customer_name || "-",
                <span className="text-yellow-500">{Array(r.rating).fill("\u2605").join("")}</span>,
                <div className="max-w-xs truncate">{r.body || r.title || "-"}</div>,
                r.is_verified_purchase ? <Badge color="green">Yes</Badge> : <Badge color="slate">No</Badge>,
                r.is_approved ? <Badge color="green">Approved</Badge> : <Badge color="yellow">Pending</Badge>,
                <div className="flex gap-2">
                  {!r.is_approved
                    ? <button onClick={() => approve(r.id, true)} className="text-green-600 text-xs hover:underline bg-transparent border-none cursor-pointer font-sans p-0">Approve</button>
                    : <button onClick={() => approve(r.id, false)} className="text-yellow-600 text-xs hover:underline bg-transparent border-none cursor-pointer font-sans p-0">Unapprove</button>
                  }
                </div>
              ])}
            />
        }
      </Card>
    </div>
  )
}

// ---------- Pages ----------
function PagesList() {
  const { data, loading, error } = useAsync(() => api("/pages"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  const list = (data as any[]) || []
  return (
    <div>
      <PageHd title="CMS Pages" action={<a href="/admin/pages/new" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white no-underline inline-block hover:bg-blue-700">+ New Page</a>} />
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No pages</div>
          : <DataTable headers={["Title", "Slug", "Published", "Updated", ""]}
              rows={list.map((p: any) => [
                <a href={`/admin/pages/${p.id}`} className="text-blue-600 no-underline font-medium">{p.title}</a>,
                p.slug,
                p.is_published ? <Badge color="green">Published</Badge> : <Badge color="yellow">Draft</Badge>,
                p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "-",
                <a href={`/admin/pages/${p.id}`} className="text-blue-600 no-underline text-xs">Edit</a>
              ])}
            />
        }
      </Card>
    </div>
  )
}
function PageForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "", isPublished: false })
  const [saving, setSaving] = React.useState(false); const [error, setError] = React.useState(""); const [ready, setReady] = React.useState(!isEdit)
  React.useEffect(() => { if (id) { api(`/pages/${id}`).then((d: any) => { setForm(d); setReady(true) }).catch(e => setError(e.message)) } }, [id])
  const set = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value })
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); try { if (isEdit) await api(`/pages/${id}`, { method: "PUT", body: JSON.stringify(form) }); else await api("/pages", { method: "POST", body: JSON.stringify(form) }); window.location.href = "/admin/pages" } catch (e: any) { setError(e.message) } finally { setSaving(false) } }
  if (!ready) return <Spinner />
  return <div><PageHd title={isEdit ? "Edit Page" : "New Page"} />{error && <Err msg={error} />}<Card><form onSubmit={submit} className="max-w-2xl space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Title</label><Input value={form.title} onChange={set("title")} required /></div><div><label className="block text-sm font-medium mb-1.5">Slug</label><Input value={form.slug} onChange={set("slug")} required /></div></div><div><label className="block text-sm font-medium mb-1.5">Content (HTML)</label><TextArea value={form.content} onChange={set("content")} rows={12} className="font-mono text-xs" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Meta Title</label><Input value={form.metaTitle} onChange={set("metaTitle")} /></div><div><label className="block text-sm font-medium mb-1.5">Meta Description</label><Input value={form.metaDescription} onChange={set("metaDescription")} /></div></div><Toggle value={form.isPublished} onChange={v => setForm({ ...form, isPublished: v })} label="Published" /><div className="flex gap-3 pt-4"><Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Btn><a href="/admin/pages"><Btn type="button" primary={false}>Cancel</Btn></a></div></form></Card></div>
}

// ---------- Menus ----------
function MenusList() {
  const { data, loading, error } = useAsync(() => api("/menus"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  const list = (data as any[]) || []
  return (
    <div>
      <PageHd title="Menus" action={<a href="/admin/menus/new" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white no-underline inline-block hover:bg-blue-700">+ New Menu</a>} />
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No menus</div>
          : <DataTable headers={["Name", "Location", "Items", "Active", ""]}
              rows={list.map((m: any) => [
                <a href={`/admin/menus/${m.id}`} className="text-blue-600 no-underline font-medium">{m.name}</a>,
                m.location,
                String(m.item_count || 0),
                m.is_active ? <Badge color="green">Yes</Badge> : <Badge color="red">No</Badge>,
                <a href={`/admin/menus/${m.id}`} className="text-blue-600 no-underline text-xs">Edit</a>
              ])}
            />
        }
      </Card>
    </div>
  )
}
function MenuForm({ id }: { id?: string }) {
  const isEdit = !!id
  const [form, setForm] = React.useState<any>({ name: "", location: "header", isActive: true, items: [{ title: "", url: "", type: "custom", sortOrder: 0 }] })
  const [saving, setSaving] = React.useState(false); const [error, setError] = React.useState(""); const [ready, setReady] = React.useState(!isEdit)
  React.useEffect(() => { if (id) { api(`/menus/${id}`).then((d: any) => { setForm({ name: d.name || "", location: d.location || "header", isActive: d.isActive !== false, items: d.items?.length ? d.items : [{ title: "", url: "", type: "custom", sortOrder: 0 }] }); setReady(true) }).catch(e => setError(e.message)) } }, [id])
  const set = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value })
  const setItem = (i: number, f: string) => (e: any) => { const items = [...form.items]; items[i] = { ...items[i], [f]: e.target.value }; setForm({ ...form, items }) }
  const addItem = () => setForm({ ...form, items: [...form.items, { title: "", url: "", type: "custom", sortOrder: form.items.length }] })
  const removeItem = (i: number) => setForm({ ...form, items: form.items.filter((_: any, idx: number) => idx !== i) })
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); setError(""); try { if (isEdit) await api(`/menus/${id}`, { method: "PUT", body: JSON.stringify(form) }); else await api("/menus", { method: "POST", body: JSON.stringify(form) }); window.location.href = "/admin/menus" } catch (e: any) { setError(e.message) } finally { setSaving(false) } }
  if (!ready) return <Spinner />
  return <div><PageHd title={isEdit ? "Edit Menu" : "New Menu"} />{error && <Err msg={error} />}<Card><form onSubmit={submit} className="max-w-xl space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1.5">Name</label><Input value={form.name} onChange={set("name")} required /></div><div><label className="block text-sm font-medium mb-1.5">Location</label><Select value={form.location} onChange={set("location")} options={[{ value: "header", label: "Header" }, { value: "footer", label: "Footer" }, { value: "sidebar", label: "Sidebar" }, { value: "mobile", label: "Mobile" }]} /></div></div><Toggle value={form.isActive} onChange={v => setForm({ ...form, isActive: v })} label="Active" /><div className="border-t pt-4"><h3 className="text-sm font-semibold mb-3">Menu Items</h3>{form.items.map((item: any, i: number) => <div key={i} className="flex gap-2 items-start mb-2 p-2 bg-slate-50 rounded"><div className="flex-1"><Input placeholder="Title" value={item.title} onChange={setItem(i, "title")} /></div><div className="flex-1"><Input placeholder="URL" value={item.url} onChange={setItem(i, "url")} /></div><button type="button" onClick={() => removeItem(i)} className="mt-0.5 px-2 py-1 text-red-600 text-xs hover:bg-red-50 rounded border border-red-200">✕</button></div>)}<Btn type="button" primary={false} onClick={addItem}>+ Add Item</Btn></div><div className="flex gap-3 pt-4"><Btn type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Btn><a href="/admin/menus"><Btn type="button" primary={false}>Cancel</Btn></a></div></form></Card></div>
}

// ---------- Inventory ----------
function InventoryList() {
  const { data, loading, error } = useAsync(() => api("/inventory"), [])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  const list = (data as any[]) || []
  return (
    <div>
      <PageHd title="Inventory" />
      <Card>
        {list.length === 0
          ? <div className="py-10 text-center text-slate-400">No inventory data</div>
          : <DataTable headers={["Product", "Variant", "SKU", "Location", "Qty", "Reserved", "Available", "Low Stock"]}
              rows={list.map((i: any) => {
                const avail = (i.quantity || 0) - (i.reserved_quantity || 0)
                return [
                  <span className="text-sm font-medium">{i.product_name || "-"}</span>,
                  i.variant_name || "-",
                  i.sku || "-",
                  i.location_name || "-",
                  String(i.quantity ?? 0),
                  String(i.reserved_quantity ?? 0),
                  <span className={avail <= (i.low_stock_threshold || 5) ? "text-red-600 font-semibold" : "text-green-600"}>{avail}</span>,
                  String(i.low_stock_threshold || 5)
                ]
              })}
            />
        }
      </Card>
    </div>
  )
}

// ---------- Settings ----------
function SettingsList() {
  const { data, loading, error } = useAsync(() => api("/settings"), [])
  const [saving, setSaving] = React.useState(false); const [msg, setMsg] = React.useState(""); const [values, setValues] = React.useState<Record<string, string>>({})
  React.useEffect(() => { if (data) { const d = data as any[]; setValues(Object.fromEntries(d.map((s: any) => [s.key, s.value]))) } }, [data])
  if (loading) return <Spinner />; if (error) return <Err msg={error} />
  const list = (data as any[]) || []
  const save = async () => { setSaving(true); setMsg(""); try { await api("/settings", { method: "PUT", body: JSON.stringify(values) }); setMsg("Settings saved") } catch (e: any) { setMsg(e.message) } finally { setSaving(false) } }
  return (
    <div>
      <PageHd title="Settings" />
      {msg && <Err msg={msg} />}
      <Card>
        {list.length === 0
          ? <div className="text-slate-400">No settings</div>
          : <div className="space-y-4">
              {list.map(s => (
                <div key={s.key} className="flex items-center gap-4">
                  <div className="w-48 shrink-0">
                    <label className="text-sm font-medium text-slate-700">{s.key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</label>
                    {s.description && <p className="text-xs text-slate-400">{s.description}</p>}
                  </div>
                  <div className="flex-1">
                    {s.type === "boolean"
                      ? <select value={values[s.key] || "false"} onChange={e => setValues({ ...values, [s.key]: e.target.value })} className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm">
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      : <Input value={values[s.key] || ""} onChange={e => setValues({ ...values, [s.key]: e.target.value })} />
                    }
                  </div>
                </div>
              ))}
              <Btn onClick={save} disabled={saving} className="mt-6">{saving ? "Saving..." : "Save Settings"}</Btn>
            </div>
        }
      </Card>
    </div>
  )
}

// ---------- Router ----------
function matchRoute(path: string) {
  const p = path.split("/").filter(Boolean)
  if (path === "/admin" || path === "/admin/") return { page: "dashboard" }
  if (path === "/admin/login") return { page: "login" }
  if (p[1] === "products" && p[2] === "new") return { page: "product-new" }
  if (p[1] === "products" && p[2]) return { page: "product-edit", params: { id: p[2] } }
  if (p[1] === "products") return { page: "products" }
  if (p[1] === "orders" && p[2]) return { page: "order-show", params: { id: p[2] } }
  if (p[1] === "orders") return { page: "orders" }
  if (p[1] === "customers") return { page: "customers" }
  if (p[1] === "coupons" && p[2] === "new") return { page: "coupon-new" }
  if (p[1] === "coupons" && p[2]) return { page: "coupon-edit", params: { id: p[2] } }
  if (p[1] === "coupons") return { page: "coupons" }
  if (p[1] === "collections" && p[2] === "new") return { page: "collection-new" }
  if (p[1] === "collections" && p[2]) return { page: "collection-edit", params: { id: p[2] } }
  if (p[1] === "collections") return { page: "collections" }
  if (p[1] === "reviews") return { page: "reviews" }
  if (p[1] === "pages" && p[2] === "new") return { page: "page-new" }
  if (p[1] === "pages" && p[2]) return { page: "page-edit", params: { id: p[2] } }
  if (p[1] === "pages") return { page: "pages" }
  if (p[1] === "menus" && p[2] === "new") return { page: "menu-new" }
  if (p[1] === "menus" && p[2]) return { page: "menu-edit", params: { id: p[2] } }
  if (p[1] === "menus") return { page: "menus" }
  if (p[1] === "inventory") return { page: "inventory" }
  if (p[1] === "settings") return { page: "settings" }
  return { page: "dashboard" }
}

export default function AdminApp() {
  const [path, setPath] = React.useState(window.location.pathname)
  React.useEffect(() => { const h = () => setPath(window.location.pathname); window.addEventListener("popstate", h); return () => window.removeEventListener("popstate", h) }, [])
  const route = matchRoute(path); const token = localStorage.getItem("vkrama_admin_token")
  if (!token && route.page !== "login") { window.location.href = "/admin/login"; return null }
  if (route.page === "login") return <LoginPage />
  const pid = route.params?.id
  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />, products: <ProductsList />, "product-new": <ProductForm />, "product-edit": <ProductForm id={pid} />,
    orders: <OrdersList />, "order-show": <OrderShow />, customers: <CustomersList />,
    coupons: <CouponsList />, "coupon-new": <CouponForm />, "coupon-edit": <CouponForm id={pid} />,
    collections: <CollectionsList />, "collection-new": <CollectionForm />, "collection-edit": <CollectionForm id={pid} />,
    reviews: <ReviewsList />,
    pages: <PagesList />, "page-new": <PageForm />, "page-edit": <PageForm id={pid} />,
    menus: <MenusList />, "menu-new": <MenuForm />, "menu-edit": <MenuForm id={pid} />,
    inventory: <InventoryList />, settings: <SettingsList />,
  }
  return <Layout>{pages[route.page] || <Dashboard />}</Layout>
}
