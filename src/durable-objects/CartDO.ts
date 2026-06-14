import { DurableObject } from "cloudflare:workers"

interface CartItem {
  variantId: string
  productId: string
  name: string
  variantName: string | null
  imageUrl: string | null
  priceCents: number
  quantity: number
  maxQuantity: number | null
  sku: string | null
}

interface CartState {
  items: CartItem[]
  customerId: string | null
  sessionId: string
  couponCode: string | null
  updatedAt: number
}

export class CartDO extends DurableObject<CartState> {
  private items: CartItem[] = []
  private customerId: string | null = null
  private sessionId: string = ""
  private couponCode: string | null = null

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.blockConcurrencyWhile(async () => {
      const state = await ctx.storage.get<CartState>("cart")
      if (state) {
        this.items = state.items
        this.customerId = state.customerId
        this.sessionId = state.sessionId
        this.couponCode = state.couponCode
      }
    })
  }

  private async persist() {
    await this.ctx.storage.put<CartState>("cart", {
      items: this.items,
      customerId: this.customerId,
      sessionId: this.sessionId,
      couponCode: this.couponCode,
      updatedAt: Date.now(),
    })
  }

  async getCart(): Promise<CartState> {
    return {
      items: this.items,
      customerId: this.customerId,
      sessionId: this.sessionId,
      couponCode: this.couponCode,
      updatedAt: Date.now(),
    }
  }

  async addItem(item: CartItem) {
    const existing = this.items.find((i) => i.variantId === item.variantId)
    if (existing) {
      const newQty = existing.quantity + item.quantity
      if (item.maxQuantity && newQty > item.maxQuantity) {
        throw new Error(`Maximum quantity for ${item.name} is ${item.maxQuantity}`)
      }
      existing.quantity = newQty
    } else {
      this.items.push(item)
    }
    await this.persist()
    return this.getCart()
  }

  async updateQuantity(variantId: string, quantity: number) {
    if (quantity < 1) {
      return this.removeItem(variantId)
    }
    const item = this.items.find((i) => i.variantId === variantId)
    if (!item) throw new Error("Item not found in cart")
    if (item.maxQuantity && quantity > item.maxQuantity) {
      throw new Error(`Maximum quantity for ${item.name} is ${item.maxQuantity}`)
    }
    item.quantity = quantity
    await this.persist()
    return this.getCart()
  }

  async removeItem(variantId: string) {
    this.items = this.items.filter((i) => i.variantId !== variantId)
    await this.persist()
    return this.getCart()
  }

  async clearCart() {
    this.items = []
    this.couponCode = null
    await this.persist()
    return this.getCart()
  }

  async setCustomer(customerId: string | null) {
    this.customerId = customerId
    await this.persist()
  }

  async applyCoupon(code: string | null) {
    this.couponCode = code
    await this.persist()
  }

  async getItemCount(): Promise<number> {
    return this.items.reduce((sum, i) => sum + i.quantity, 0)
  }

  async getSubtotalCents(): Promise<number> {
    return this.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0)
  }

  async mergeCarts(sessionItems: CartItem[]) {
    for (const sessionItem of sessionItems) {
      const existing = this.items.find((i) => i.variantId === sessionItem.variantId)
      if (existing) {
        existing.quantity = Math.max(existing.quantity, sessionItem.quantity)
      } else {
        this.items.push(sessionItem)
      }
    }
    await this.persist()
  }
}
