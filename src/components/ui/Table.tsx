import { useState, useMemo } from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  loading,
  emptyMessage = 'No data found.',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-8 text-center text-surface-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-surface-600 ${
                    col.sortable ? 'cursor-pointer hover:text-surface-900 select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-brand-600">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-surface-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((item, i) => (
                <tr
                  key={(item.id as string) || i}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-surface-50' : ''} transition-colors`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-surface-700">
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
