import { useEffect, useMemo, useState } from 'react'
import { Boxes, AlertTriangle, PackageX, Search, SlidersHorizontal, History } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/features/admin/components/StatCard'
import { AdjustStockModal } from './components/AdjustStockModal'
import { useInventoryStore } from '@/store/useInventoryStore'
import { useToast } from '@/components/ui/Toast'
import { formatDate, cn } from '@/lib/utils'
import type { Product } from '@/types'

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

const LOW_STOCK_THRESHOLD = 15

export default function AdminInventoryPage() {
  const products = useInventoryStore((s) => s.products)
  const fetchProducts = useInventoryStore((s) => s.fetchProducts)
  const history = useInventoryStore((s) => s.history)
  const fetchHistory = useInventoryStore((s) => s.fetchHistory)
  const adjustStock = useInventoryStore((s) => s.adjustStock)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [view, setView] = useState<'stock' | 'history'>('stock')
  const [filter, setFilter] = useState<StockFilter>('all')
  const [query, setQuery] = useState('')
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null)

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = !query.trim() || p.title.toLowerCase().includes(query.trim().toLowerCase())
      const matchesFilter =
        filter === 'all' ||
        (filter === 'in_stock' && p.stock > LOW_STOCK_THRESHOLD) ||
        (filter === 'low_stock' && p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD) ||
        (filter === 'out_of_stock' && p.stock === 0)
      return matchesQuery && matchesFilter
    })
  }, [products, query, filter])

  async function handleAdjust(delta: number, reason: string) {
    if (!adjustTarget) return
    try {
      await adjustStock(adjustTarget.id, delta, reason)
      await fetchHistory() // history-log turant refresh, taaki naya adjustment dikhe
      toast({ type: 'success', title: 'Stock updated', description: `${adjustTarget.title}: ${delta > 0 ? '+' : ''}${delta}` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to adjust stock', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Inventory</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Track stock levels and adjustment history.</p>
        </div>
        <div className="flex gap-1.5">
          <Button variant={view === 'stock' ? 'primary' : 'outline'} size="sm" leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />} onClick={() => setView('stock')}>
            Stock Levels
          </Button>
          <Button variant={view === 'history' ? 'primary' : 'outline'} size="sm" leftIcon={<History className="h-3.5 w-3.5" />} onClick={() => setView('history')}>
            History Log
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Stock Units" value={totalStock.toLocaleString('en-IN')} icon={<Boxes className="h-5 w-5" />} />
        <StatCard label="Low Stock Items" value={lowStockCount.toString()} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard label="Out of Stock Items" value={outOfStockCount.toString()} icon={<PackageX className="h-5 w-5" />} />
      </div>

      {view === 'stock' ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {([
                { id: 'all', label: 'All' },
                { id: 'in_stock', label: 'In Stock' },
                { id: 'low_stock', label: 'Low Stock' },
                { id: 'out_of_stock', label: 'Out of Stock' },
              ] as { id: StockFilter; label: string }[]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                    filter === t.id
                      ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                      : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-64">
              <Input placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
            </div>
          </div>

          <div className="surface-card mt-5 overflow-x-auto">
            {filtered.length === 0 ? (
              <EmptyState title="No products found" description="Try a different filter or search term." />
            ) : (
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-porcelain-300 text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]?.url} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                          <span className="line-clamp-1 max-w-[240px] font-medium text-ink-950 dark:text-porcelain-100">{p.title}</span>
                        </div>
                      </td>
                      <td className="price px-4 py-3 font-semibold text-ink-950 dark:text-porcelain-100">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-semibold',
                            p.stock === 0
                              ? 'bg-danger-500/10 text-danger-500'
                              : p.stock <= LOW_STOCK_THRESHOLD
                                ? 'bg-warning-500/15 text-warning-500'
                                : 'bg-success-500/10 text-success-500',
                          )}
                        >
                          {p.stock === 0 ? 'Out of Stock' : p.stock <= LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setAdjustTarget(p)}>Adjust Stock</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div className="surface-card mt-6">
          {history.length === 0 ? (
            <EmptyState icon={<History className="h-7 w-7" />} title="No adjustments yet" description="Stock adjustments you make will be logged here." />
          ) : (
            <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-4">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                      entry.change > 0 ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500',
                    )}
                  >
                    {entry.change > 0 ? '+' : ''}{entry.change}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{entry.productTitle}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{entry.reason}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="price text-xs text-ink-600 dark:text-porcelain-300/60">{entry.previousStock} → {entry.newStock}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/50">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AdjustStockModal product={adjustTarget} onClose={() => setAdjustTarget(null)} onConfirm={handleAdjust} />
    </div>
  )
}