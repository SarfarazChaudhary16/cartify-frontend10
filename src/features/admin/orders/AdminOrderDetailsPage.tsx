import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ArrowRight, PackageX, IndianRupee } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { OrderTrackingTimeline } from '@/features/orders/components/OrderTrackingTimeline'
import { useOrdersStore } from '@/store/useOrdersStore'
import { orderStatusVariant, formatOrderStatus, nextOrderStatus, nextOrderStatusLabel, refundableStatuses } from '@/lib/orderStatus'
import { formatDate, formatPrice } from '@/lib/utils'

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams()
  const orders = useOrdersStore((s) => s.orders)
  const order = useOrdersStore((s) => (orderId ? s.getOrder(orderId) : undefined))
  const fetchAllOrdersAdmin = useOrdersStore((s) => s.fetchAllOrdersAdmin)
  const advanceStatus = useOrdersStore((s) => s.advanceStatus)
  const processRefund = useOrdersStore((s) => s.processRefund)
  const { toast } = useToast()

  useEffect(() => {
    // Direct-link/refresh case ke liye — agar Admin seedha is order-URL
    // pe aaye (store abhi khaali ho), poori list fetch kar lete hain
    if (orders.length === 0) fetchAllOrdersAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!order) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<PackageX className="h-7 w-7" />}
          title="Order not found"
          action={<Link to="/admin/orders"><Button variant="outline">Back to Orders</Button></Link>}
        />
      </div>
    )
  }

  const next = nextOrderStatus[order.status]
  const canRefund = refundableStatuses.includes(order.status)

  async function handleAdvance() {
    try {
      await advanceStatus(order!.id)
      toast({ type: 'success', title: `Order marked as ${formatOrderStatus(next!)}` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update status', description: err.response?.data?.message })
    }
  }

  async function handleRefund() {
    try {
      await processRefund(order!.id)
      toast({ type: 'success', title: 'Refund processed', description: formatPrice(order!.total) })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to process refund', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <Link to="/admin/orders" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-porcelain-300/70">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Order #{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={orderStatusVariant[order.status]} className="capitalize">
            {formatOrderStatus(order.status)}
          </Badge>
          {next && (
            <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={handleAdvance}>
              {nextOrderStatusLabel[order.status]}
            </Button>
          )}
          {canRefund && (
            <Button size="sm" variant="outline" leftIcon={<IndianRupee className="h-3.5 w-3.5" />} onClick={handleRefund}>
              Process Refund
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="mb-5 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Tracking</h2>
            <OrderTrackingTimeline steps={order.trackingSteps} />
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{item.title}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">
                      {[item.color, item.size].filter(Boolean).join(' · ')} {item.color || item.size ? '· ' : ''}Qty {item.quantity}
                    </p>
                  </div>
                  <span className="price text-sm font-semibold text-ink-950 dark:text-porcelain-100">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Customer</h2>
            <p className="text-sm text-ink-600 dark:text-porcelain-300/70">
              {order.address.fullName}<br />
              {order.address.phone}
            </p>
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Delivery Address</h2>
            <p className="text-sm text-ink-600 dark:text-porcelain-300/70">
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
              {order.address.city}, {order.address.state} {order.address.pincode}
            </p>
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Payment</h2>
            <p className="text-sm capitalize text-ink-600 dark:text-porcelain-300/70">{order.paymentMethod}</p>
            <div className="mt-3 flex justify-between border-t border-porcelain-300 pt-3 text-base font-semibold text-ink-950 dark:border-ink-700 dark:text-porcelain-100">
              <span>Total</span>
              <span className="price">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}