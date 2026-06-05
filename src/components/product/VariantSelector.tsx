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
}

export default function VariantSelector({ options, variants, basePriceCents }: VariantSelectorProps) {
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
      } else {
        delete el.dataset.variantId
        delete el.dataset.variantName
        delete el.dataset.variantPrice
      }
    }
  }, [matchedVariant])

  function select(group: string, value: string) {
    setSelected((prev) => ({ ...prev, [group]: value }))
  }

  const displayPrice = matchedVariant?.priceCents ?? basePriceCents
  const inStock = matchedVariant ? matchedVariant.stock > 0 : variants.some((v) => v.stock > 0)
  const allSelected = Object.keys(selected).length === groups.length

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">${(displayPrice / 100).toFixed(2)}</span>
        {!inStock && allSelected && <span className="badge-red">Out of Stock</span>}
      </div>

      <div id="variant-data" data-has-variants={variants.length > 0 ? 'true' : 'false'} />

      {groups.map(([group, values]) => (
        <div key={group}>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{group}</label>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selected[group] === value
              return (
                <button
                  key={value}
                  type="button"
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  onClick={() => select(group, value)}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
