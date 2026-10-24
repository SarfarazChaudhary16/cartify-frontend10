import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useProductsStore } from '@/store/useProductsStore'
import { orderStatusVariant, formatOrderStatus } from '@/lib/orderStatus'
import { formatDate, formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const tabs: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returned', label: 'Returned' },
]

export default function OrderHistoryPage() {
  const orders = useOrdersStore((s) => s.orders)
  const fetchOrders = useOrdersStore((s) => s.fetchOrders)
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [tab, setTab] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = tab === 'all' || o.status === tab
      const matchesQuery = !query.trim() || o.orderNumber.toLowerCase().includes(query.trim().toLowerCase())
      return matchesTab && matchesQuery
    })
  }, [orders, tab, query])

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Order History</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Track, return, or manage your past orders.</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                  : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <Input placeholder="Search order number…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState icon={<Package className="h-7 w-7" />} title="No orders found" description="Try a different filter or search term." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/account/orders/${order.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/account/orders/${order.id}`)}
              className="surface-card surface-card-lift cursor-pointer p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">#{order.orderNumber}</p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Placed on {formatDate(order.placedAt)}</p>
                </div>
                <Badge variant={orderStatusVariant[order.status]} className="capitalize">
                  {formatOrderStatus(order.status)}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 4).map((item, i) => {
                    // NAYA: getProductById() (mock) hataya — ab REAL
                    // catalog (useProductsStore) mein dhoondhte hain
                    const product = products.find((p) => p.id === item.productId)
                    const thumb = (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-14 w-14 rounded-xl border-2 border-white object-cover transition-transform hover:z-10 hover:scale-105 dark:border-ink-900"
                      />
                    )
                    return product ? (
                      <Link
                        key={i}
                        to={`/product/${product.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block"
                        aria-label={`View ${item.title}`}
                      >
                        {thumb}
                      </Link>
                    ) : (
                      <span key={i}>{thumb}</span>
                    )
                  })}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-950 dark:text-porcelain-100">
                    {order.items.map((i) => i.title).join(', ')}
                  </p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{order.items.length} item(s)</p>
                </div>
                <span className="price shrink-0 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}