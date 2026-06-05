import { useState, useEffect, useCallback } from 'react'

interface CartItem {
  id: string
  slug: string
  name: string
  priceCents: number
  quantity: number
  imageUrl: string
  variantId?: string
  variantName?: string
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [animating, setAnimating] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const loadCart = useCallback(() => {
    setCart(JSON.parse(localStorage.getItem('vkrama_cart') || '[]'))
  }, [])

  useEffect(() => {
    loadCart()
    const handler = () => loadCart()
    window.addEventListener('cart-updated', handler)
    window.addEventListener('storage', handler)

    const openHandler = () => setIsOpen(true)
    window.addEventListener('open-cart', openHandler)

    return () => {
      window.removeEventListener('cart-updated', handler)
      window.removeEventListener('storage', handler)
      window.removeEventListener('open-cart', openHandler)
    }
  }, [loadCart])

  function close() {
    setAnimating(true)
    setTimeout(() => {
      setIsOpen(false)
      setAnimating(false)
    }, 200)
  }

  function updateQty(id: string, delta: number) {
    const newCart = [...cart]
    const item = newCart.find((i) => i.id === id)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) {
      const idx = newCart.indexOf(item)
      newCart.splice(idx, 1)
    }
    setCart(newCart)
    localStorage.setItem('vkrama_cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  function removeItem(id: string) {
    const newCart = cart.filter((i) => i.id !== id)
    setCart(newCart)
    localStorage.setItem('vkrama_cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const total = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen && !animating) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 transition-opacity"
        style={{ opacity: animating ? 0 : 1 }}
        onClick={close}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-200 ${animating ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-200">
          <div>
            <h2 className="text-lg font-semibold text-surface-900">Shopping Cart</h2>
            <p className="text-sm text-surface-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={close} className="btn-ghost btn-icon" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-surface-500 font-medium">Your cart is empty</p>
              <p className="text-surface-400 text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-surface-50 animate-fade-in">
                <div className="w-20 h-20 bg-surface-100 rounded-lg overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    Rs. {(item.priceCents / 100).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-surface-300 text-surface-600 hover:bg-surface-100 text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-surface-300 text-surface-600 hover:bg-surface-100 text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
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

        {cart.length > 0 && (
          <div className="border-t border-surface-200 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600">Subtotal</span>
              <span className="text-lg font-bold text-surface-900">Rs. {(total / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-surface-400">Shipping & taxes calculated at checkout</p>
            <a
              href="/checkout"
              className="btn-primary w-full btn-lg"
              onClick={close}
            >
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
