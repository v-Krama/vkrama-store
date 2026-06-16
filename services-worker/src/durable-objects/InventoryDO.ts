import { DurableObject } from "cloudflare:workers"

interface StockEntry {
  quantity: number
  reserved: number
}

type ReservationMap = Record<string, number>

export class InventoryDO extends DurableObject<Env, Record<string, StockEntry>> {
  private stock: Map<string, StockEntry> = new Map()
  private reservations: Map<string, ReservationMap> = new Map()

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.blockConcurrencyWhile(async () => {
      const stored = await ctx.storage.get<Record<string, StockEntry>>("stock")
      if (stored) {
        for (const [key, val] of Object.entries(stored)) {
          this.stock.set(key, val)
        }
      }
      const resStored = await ctx.storage.get<Record<string, ReservationMap>>("reservations")
      if (resStored) {
        for (const [key, val] of Object.entries(resStored)) {
          this.reservations.set(key, val)
        }
      }
    })
  }

  private async persistStock() {
    const obj: Record<string, StockEntry> = {}
    for (const [key, val] of this.stock) {
      obj[key] = val
    }
    await this.ctx.storage.put("stock", obj)
  }

  private async persistReservations() {
    const obj: Record<string, ReservationMap> = {}
    for (const [key, val] of this.reservations) {
      obj[key] = val
    }
    await this.ctx.storage.put("reservations", obj)
  }

  async setStock(variantId: string, quantity: number): Promise<StockEntry> {
    const existing = this.stock.get(variantId) || { quantity: 0, reserved: 0 }
    existing.quantity = quantity
    this.stock.set(variantId, existing)
    await this.persistStock()
    return existing
  }

  async adjustStock(variantId: string, delta: number, reason?: string): Promise<StockEntry> {
    const existing = this.stock.get(variantId) || { quantity: 0, reserved: 0 }
    existing.quantity += delta
    this.stock.set(variantId, existing)
    await this.persistStock()
    return existing
  }

  async reserve(
    variantId: string,
    quantity: number,
    reservationId: string,
  ): Promise<{ success: boolean; available: number }> {
    const entry = this.stock.get(variantId) || { quantity: 0, reserved: 0 }
    const available = entry.quantity - entry.reserved

    if (available < quantity) {
      return { success: false, available }
    }

    entry.reserved += quantity
    this.stock.set(variantId, entry)

    const reservationMap = this.reservations.get(variantId) || {}
    reservationMap[reservationId] = (reservationMap[reservationId] || 0) + quantity
    this.reservations.set(variantId, reservationMap)

    await Promise.all([this.persistStock(), this.persistReservations()])
    return { success: true, available: entry.quantity - entry.reserved }
  }

  async release(reservationId: string, variantId?: string): Promise<void> {
    if (variantId) {
      const reservationMap = this.reservations.get(variantId)
      if (reservationMap) {
        const qty = reservationMap[reservationId] || 0
        delete reservationMap[reservationId]
        const entry = this.stock.get(variantId)
        if (entry) {
          entry.reserved -= qty
        }
        await Promise.all([this.persistStock(), this.persistReservations()])
      }
    } else {
      for (const [vid, reservationMap] of this.reservations) {
        if (reservationMap[reservationId]) {
          const qty = reservationMap[reservationId]
          delete reservationMap[reservationId]
          const entry = this.stock.get(vid)
          if (entry) {
            entry.reserved -= qty
          }
        }
      }
      await Promise.all([this.persistStock(), this.persistReservations()])
    }
  }

  async confirmReservation(reservationId: string): Promise<void> {
    for (const [vid, reservationMap] of this.reservations) {
      if (reservationMap[reservationId]) {
        const qty = reservationMap[reservationId]
        delete reservationMap[reservationId]
        const entry = this.stock.get(vid)
        if (entry) {
          entry.quantity -= qty
          entry.reserved -= qty
        }
      }
    }
    await Promise.all([this.persistStock(), this.persistReservations()])
  }

  async getStock(variantId: string): Promise<StockEntry> {
    return this.stock.get(variantId) || { quantity: 0, reserved: 0 }
  }

  async getAvailable(variantId: string): Promise<number> {
    const entry = this.stock.get(variantId) || { quantity: 0, reserved: 0 }
    return entry.quantity - entry.reserved
  }

  async bulkGetStock(variantIds: string[]): Promise<Record<string, StockEntry>> {
    const result: Record<string, StockEntry> = {}
    for (const id of variantIds) {
      result[id] = this.stock.get(id) || { quantity: 0, reserved: 0 }
    }
    return result
  }
}
