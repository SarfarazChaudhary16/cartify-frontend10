import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Zap, Sparkles, Star } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal'
import { useAdminProductsStore } from '@/store/useAdminProductsStore'
import { useAdminCategoriesStore } from '@/store/useAdminCategoriesStore'
import { useAdminBrandsStore } from '@/store/useAdminBrandsStore'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, cn } from '@/lib/utils'

export default function AdminProductsPage() {
  const products = useAdminProductsStore((s) => s.products)
  const fetchProducts = useAdminProductsStore((s) => s.fetchProducts)
  const deleteProduct = useAdminProductsStore((s) => s.deleteProduct)
  const bulkDelete = useAdminProductsStore((s) => s.bulkDelete)
  const bulkSetFlag = useAdminProductsStore((s) => s.bulkSetFlag)
  const categories = useAdminCategoriesStore((s) => s.categories)
  const fetchCategories = useAdminCategoriesStore((s) => s.fetchCategories)
  const brands = useAdminBrandsStore((s) => s.brands)
  const fetchBrands = useAdminBrandsStore((s) => s.fetchBrands)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (products.length === 0) fetchProducts()
    if (categories.length === 0) fetchCategories()
    if (brands.length === 0) fetchBrands()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = !query.trim() || p.title.toLowerCase().includes(query.trim().toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter
      return matchesQuery && matchesCategory
    })
  }, [products, query, categoryFilter])

  function toggleSelect(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function toggleSelectAll() {
    setSelected((s) => (s.length === filtered.length ? [] : filtered.map((p) => p.id)))
  }

  async function handleBulkDelete() {
    try {
      await bulkDelete(selected)
      toast({ type: 'success', title: `${selected.length} product(s) deleted` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to delete', description: err.response?.data?.message })
    }
    setSelected([])
    setBulkDeleteOpen(false)
  }

  async function handleBulkFlag(flag: 'isFlashSale' | 'isBestSeller' | 'isNew', label: string) {
    try {
      await bulkSetFlag(selected, flag, true)
      toast({ type: 'success', title: `Marked as ${label}` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Products</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{products.length} products in catalog</p>
        </div>
        <Link to="/admin/products/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Product</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <Input placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-11 rounded-xl border border-porcelain-300 bg-white px-4 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-cobalt-500/10 px-4 py-3">
          <span className="text-sm font-medium text-cobalt-600 dark:text-cobalt-400">{selected.length} selected</span>
          <Button size="sm" variant="outline" leftIcon={<Zap className="h-3.5 w-3.5" />} onClick={() => handleBulkFlag('isFlashSale', 'Flash Sale')}>
            Mark Flash Sale
          </Button>
          <Button size="sm" variant="outline" leftIcon={<Star className="h-3.5 w-3.5" />} onClick={() => handleBulkFlag('isBestSeller', 'Best Seller')}>
            Mark Best Seller
          </Button>
          <Button size="sm" variant="outline" leftIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={() => handleBulkFlag('isNew', 'New')}>
            Mark New
          </Button>
          <Button size="sm" variant="danger" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setBulkDeleteOpen(true)}>
            Delete Selected
          </Button>
        </div>
      )}

      <div className="surface-card mt-5 overflow-x-auto">
        {filtered.length === 0 ? (
          <EmptyState title="No products found" description="Try a different search or filter." />
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-porcelain-300 text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded" />
                </th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
              {filtered.map((p) => {
                const brand = brands.find((b) => b.id === p.brandId)
                return (
                  <tr key={p.id} className={cn(selected.includes(p.id) && 'bg-cobalt-500/[0.04]')}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="h-4 w-4 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]?.url} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                        <span className="line-clamp-1 max-w-[220px] font-medium text-ink-950 dark:text-porcelain-100">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-600 dark:text-porcelain-300/70">{brand?.name ?? '—'}</td>
                    <td className="price px-4 py-3 font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('font-medium', p.stock === 0 ? 'text-danger-500' : p.stock <= 15 ? 'text-warning-500' : 'text-ink-950 dark:text-porcelain-100')}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isNew && <Badge variant="cobalt">New</Badge>}
                        {p.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
                        {p.isFlashSale && <Badge variant="danger">Flash Sale</Badge>}
                        {!p.isNew && !p.isBestSeller && !p.isFlashSale && <span className="text-xs text-ink-600 dark:text-porcelain-300/50">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} aria-label="Edit" className="rounded-lg p-1.5 text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p.id)} aria-label="Delete" className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this product?"
        description="This will permanently remove it from the catalog."
        onConfirm={async () => {
          if (deleteTarget) {
            try {
              await deleteProduct(deleteTarget)
              toast({ type: 'success', title: 'Product deleted' })
            } catch (err: any) {
              toast({ type: 'error', title: 'Failed to delete', description: err.response?.data?.message })
            }
          }
          setDeleteTarget(null)
        }}
      />
      <ConfirmDeleteModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title={`Delete ${selected.length} product(s)?`}
        description="This will permanently remove the selected products."
        onConfirm={handleBulkDelete}
      />
    </div>
  )
}