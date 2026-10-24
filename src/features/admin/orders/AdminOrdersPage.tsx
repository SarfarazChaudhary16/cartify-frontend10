import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Search, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { useOrdersStore } from '@/store/useOrdersStore'
import { orderStatusVariant, formatOrderStatus, nextOrderStatus, nextOrderStatusLabel } from '@/lib/orderStatus'
import { formatDate, formatPrice, cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const tabs: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'packed', label: 'Packed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returned', label: 'Returned' },
  { id: 'refunded', label: 'Refunded' },
]

export default function AdminOrdersPage() {
  const orders = useOrdersStore((s) => s.orders)
  const fetchAllOrdersAdmin = useOrdersStore((s) => s.fetchAllOrdersAdmin)
  const advanceStatus = useOrdersStore((s) => s.advanceStatus)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchAllOrdersAdmin()
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

  async function handleAdvance(e: React.MouseEvent, orderId: string) {
    e.stopPropagation()
    try {
      await advanceStatus(orderId)
      toast({ type: 'success', title: 'Order status updated' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update status', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Orders</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{orders.length} total orders</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium capitalize transition-colors',
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

      <div className="surface-card mt-5 overflow-x-auto">
        {filtered.length === 0 ? (
          <EmptyState icon={<Package className="h-7 w-7" />} title="No orders found" description="Try a different filter or search term." />
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-porcelain-300 text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
              {filtered.map((order) => {
                const next = nextOrderStatus[order.status]
                return (
                  <tr key={order.id} className="cursor-pointer hover:bg-porcelain-100 dark:hover:bg-ink-800" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                    <td className="px-4 py-3 font-medium text-ink-950 dark:text-porcelain-100">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-ink-600 dark:text-porcelain-300/70">{order.address.fullName}</td>
                    <td className="px-4 py-3 text-ink-600 dark:text-porcelain-300/70">{formatDate(order.placedAt)}</td>
                    <td className="price px-4 py-3 font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={orderStatusVariant[order.status]} className="capitalize">
                        {formatOrderStatus(order.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {next ? (
                        <Button
                          size="sm"
                          variant="outline"
                          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                          onClick={(e) => handleAdvance(e, order.id)}
                        >
                          {nextOrderStatusLabel[order.status]}
                        </Button>
                      ) : (
                        <span className="text-xs text-ink-600 dark:text-porcelain-300/40">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}