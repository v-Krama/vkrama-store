import { useState, useEffect, useCallback, useRef } from "react"

function getAuthToken(): string | null {
  return localStorage.getItem("vkrama_token")
}

function getSessionId(): string {
  let id = localStorage.getItem("vkrama_session_id")
  if (!id) {
    id = "sess_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    localStorage.setItem("vkrama_session_id", id)
  }
  return id
}

async function api(path: string, options?: RequestInit): Promise<any> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Cart-Session": getSessionId(),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(path, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error || "Request failed")
  }
  return res.json()
}

interface LocalCartItem {
  key: string
  productId: string
  variantId?: string
  name: string
  slug?: string
  image?: string
  price: number
  quantity: number
  variantName?: string
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<LocalCartItem[]>([])
  const [animating, setAnimating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const mounted = useRef(true)

  const loadCart = useCallback(() => {
    setLoading(true)
    try {
      const cart: LocalCartItem[] = JSON.parse(localStorage.getItem("vkrama_cart") || "[]")
      setItems(cart)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart()

    const handler = () => loadCart()
    window.addEventListener("cart-updated", handler)

    const openHandler = () => setIsOpen(true)
    window.addEventListener("open-cart", openHandler)

    const loginHandler = async () => {
      const token = getAuthToken()
      if (token) {
        const local: LocalCartItem[] = JSON.parse(localStorage.getItem("vkrama_cart") || "[]")
        if (local.length > 0) {
          try {
            await api("/api/cart/merge", {
              method: "POST",
              body: JSON.stringify({ sessionItems: local }),
            })
            localStorage.removeItem("vkrama_cart")
          } catch {}
        }
        loadCart()
      }
    }
    window.addEventListener("user-logged-in", loginHandler)

    return () => {
      mounted.current = false
      window.removeEventListener("cart-updated", handler)
      window.removeEventListener("open-cart", openHandler)
      window.removeEventListener("user-logged-in", loginHandler)
    }
  }, [loadCart])

  function saveCart(newItems: LocalCartItem[]) {
    localStorage.setItem("vkrama_cart", JSON.stringify(newItems))
    setItems(newItems)
    window.dispatchEvent(new Event("cart-updated"))
  }

  function close() {
    setAnimating(true)
    setTimeout(() => {
      if (mounted.current) {
        setIsOpen(false)
        setAnimating(false)
      }
    }, 200)
  }

  function updateQty(key: string, delta: number) {
    setError("")
    const cart = JSON.parse(localStorage.getItem("vkrama_cart") || "[]") as LocalCartItem[]
    const item = cart.find((i) => i.key === key)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) {
      const idx = cart.indexOf(item)
      cart.splice(idx, 1)
    }
    saveCart(cart)
  }

  function removeItem(key: string) {
    setError("")
    let cart = JSON.parse(localStorage.getItem("vkrama_cart") || "[]") as LocalCartItem[]
    cart = cart.filter((i) => i.key !== key)
    saveCart(cart)
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen && !animating) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 transition-opacity"
        style={{ opacity: animating ? 0 : 1 }}
        onClick={close}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-200 ${animating ? "translate-x-full" : "translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-200">
          <div>
            <h2 className="text-lg font-semibold text-surface-900">Shopping Cart</h2>
            <p className="text-sm text-surface-500">
              {loading ? "Loading..." : `${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button onClick={close} className="btn-ghost btn-icon" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
          )}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-surface-500 font-medium">Your cart is empty</p>
              <p className="text-surface-400 text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex gap-3 p-3 rounded-xl bg-surface-50 animate-fade-in">
                <div className="w-20 h-20 bg-surface-100 rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-surface-900 truncate">{item.name}</h3>
                  {item.variantName && (
                    <p className="text-xs text-surface-500">{item.variantName}</p>
                  )}
                  <p className="text-sm font-semibold text-surface-900 mt-1">
                    Rs. {(item.price / 100).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.key, -1)}
                      disabled={loading}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-surface-300 text-surface-600 hover:bg-surface-100 text-sm disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.key, 1)}
                      disabled={loading}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-surface-300 text-surface-600 hover:bg-surface-100 text-sm disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="ml-auto text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-surface-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600">Subtotal</span>
              <span className="text-lg font-bold text-surface-900">Rs. {(total / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-surface-400">Shipping & taxes calculated at checkout</p>
            <a href="/checkout" className="btn-primary w-full btn-lg" onClick={close}>
              Checkout &rarr;
            </a>
            <button onClick={close} className="btn-secondary w-full text-sm">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
