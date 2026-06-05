import { useState, useMemo, useEffect } from 'react'

interface VariantOption {
  groupName: string
  value: string
  sortOrder: number
}

interface Variant {
  id: string
  name: string
  priceCents: number | null
  stock: number
  imageUrl: string | null
}

interface VariantSelectorProps {
  options: VariantOption[]
  variants: Variant[]
  basePriceCents: number
  onVariantChange?: (variant: { id: string; name: string; priceCents: number; inStock: boolean } | null) => void
}

export default function VariantSelector({ options, variants, basePriceCents, onVariantChange }: VariantSelectorProps) {
  const groups = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const opt of [...options].sort((a, b) => a.sortOrder - b.sortOrder)) {
      const list = map.get(opt.groupName) || []
      if (!list.includes(opt.value)) list.push(opt.value)
      map.set(opt.groupName, list)
    }
    return Array.from(map.entries())
  }, [options])

  const [selected, setSelected] = useState<Record<string, string>>({})

  const matchedVariant = useMemo(() => {
    const values = Object.values(selected).filter(Boolean)
    if (values.length === 0) return null
    const name = values.join(' / ')
    return variants.find((v) => v.name === name) || null
  }, [selected, variants])

  useEffect(() => {
    const el = document.getElementById('variant-data')
    if (el) {
      if (matchedVariant) {
        el.dataset.variantId = matchedVariant.id
        el.dataset.variantName = matchedVariant.name
        el.dataset.variantPrice = String(matchedVariant.priceCents ?? basePriceCents)
        el.dataset.variantStock = String(matchedVariant.stock)
        el.dataset.variantInStock = matchedVariant.stock > 0 ? 'true' : 'false'
      } else {
        delete el.dataset.variantId
        delete el.dataset.variantName
        delete el.dataset.variantPrice
        delete el.dataset.variantStock
        delete el.dataset.variantInStock
      }
    }
    if (onVariantChange) {
      onVariantChange(
        matchedVariant
          ? { id: matchedVariant.id, name: matchedVariant.name, priceCents: matchedVariant.priceCents ?? basePriceCents, inStock: matchedVariant.stock > 0 }
          : null
      )
    }
  }, [matchedVariant, basePriceCents, onVariantChange])

  function select(group: string, value: string) {
    setSelected((prev) => ({ ...prev, [group]: value }))
  }

  const displayPrice = matchedVariant?.priceCents ?? basePriceCents
  const allSelected = groups.length === 0 || Object.keys(selected).length === groups.length
  const inStock = matchedVariant ? matchedVariant.stock > 0 : variants.length === 0 || variants.some((v) => v.stock > 0)
  const showOutOfStock = matchedVariant && matchedVariant.stock <= 0

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-surface-900">${(displayPrice / 100).toFixed(2)}</span>
        {showOutOfStock && <span className="badge-red">Out of Stock</span>}
      </div>

      <div id="variant-data" data-has-variants={variants.length > 0 ? 'true' : 'false'} />

      {groups.length === 1 && groups[0][1].length <= 4 ? (
        <div>
          <label className="label">{groups[0][0]}</label>
          <div className="flex flex-wrap gap-2">
            {groups[0][1].map((value) => {
              const isSelected = selected[groups[0][0]] === value
              return (
                <button
                  key={value}
                  type="button"
                  className={`px-4 py-2.5 text-sm rounded-lg border font-medium transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                      : 'border-surface-300 text-surface-700 hover:border-surface-400 bg-white'
                  }`}
                  onClick={() => select(groups[0][0], value)}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        groups.map(([group, values]) => (
          <div key={group}>
            <label className="label">{group}</label>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selected[group] === value
                return (
                  <button
                    key={value}
                    type="button"
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                        : 'border-surface-300 text-surface-700 hover:border-surface-400 bg-white'
                    }`}
                    onClick={() => select(group, value)}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
