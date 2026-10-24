import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, FileText, PackageX, RotateCcw, Ban } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { OrderTrackingTimeline } from './components/OrderTrackingTimeline'
import { CancelOrderModal } from './components/CancelOrderModal'
import { ReturnReplaceModal } from './components/ReturnReplaceModal'
import { InvoiceModal } from './components/InvoiceModal'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useProductsStore } from '@/store/useProductsStore'
import { orderStatusVariant, formatOrderStatus } from '@/lib/orderStatus'
import { formatDate, formatPrice } from '@/lib/utils'

const CANCELLABLE = ['pending', 'packed']
const RETURNABLE = ['delivered']

export default function OrderDetailsPage() {
  const { orderId } = useParams()
  const order = useOrdersStore((s) => (orderId ? s.getOrder(orderId) : undefined))
  const fetchOrder = useOrdersStore((s) => s.fetchOrder)
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)

  useEffect(() => {
    // Direct-link/refresh case ke liye — agar order abhi tak store
    // mein nahi hai (jaise koi seedha URL type kare), backend se laate hain
    if (orderId && !order) fetchOrder(orderId)
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const [cancelOpen, setCancelOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [invoiceOpen, setInvoiceOpen] = useState(false)

  if (!order) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<PackageX className="h-7 w-7" />}
          title="Order not found"
          description="This order may not exist or has been removed."
          action={
            <Link to="/account/orders">
              <Button variant="outline">Back to Orders</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div>
      <Link to="/account/orders" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-porcelain-300/70">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Order #{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <Badge variant={orderStatusVariant[order.status]} className="capitalize">
          {formatOrderStatus(order.status)}
        </Badge>
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
              {order.items.map((item, i) => {
                const product = products.find((p) => p.id === item.productId)
                const itemContent = (
                  <>
                    <img src={item.image} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{item.title}</p>
                      <p className="text-xs text-ink-600 dark:text-porcelain-300/60">
                        {[item.color, item.size].filter(Boolean).join(' · ')} {item.color || item.size ? '· ' : ''}Qty {item.quantity}
                      </p>
                    </div>
                  </>
                )
                return (
                  <div key={i} className="flex items-center gap-3">
                    {product ? (
                      <Link to={`/product/${product.slug}`} className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-80">
                        {itemContent}
                      </Link>
                    ) : (
                      <div className="flex min-w-0 flex-1 items-center gap-3">{itemContent}</div>
                    )}
                    <span className="price shrink-0 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Delivery Address</h2>
            <p className="text-sm text-ink-600 dark:text-porcelain-300/70">
              {order.address.fullName}<br />
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
              {order.address.city}, {order.address.state} {order.address.pincode}<br />
              {order.address.phone}
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

          <div className="surface-card space-y-2.5 p-6">
            <Button variant="outline" className="w-full" leftIcon={<FileText className="h-4 w-4" />} onClick={() => setInvoiceOpen(true)}>
              View Invoice
            </Button>
            {CANCELLABLE.includes(order.status) && (
              <Button variant="outline" className="w-full" leftIcon={<Ban className="h-4 w-4" />} onClick={() => setCancelOpen(true)}>
                Cancel Order
              </Button>
            )}
            {RETURNABLE.includes(order.status) && (
              <Button variant="outline" className="w-full" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setReturnOpen(true)}>
                Return / Replace
              </Button>
            )}
          </div>
        </div>
      </div>

      <CancelOrderModal open={cancelOpen} onClose={() => setCancelOpen(false)} orderId={order.id} />
      <ReturnReplaceModal open={returnOpen} onClose={() => setReturnOpen(false)} orderId={order.id} />
      <InvoiceModal open={invoiceOpen} onClose={() => setInvoiceOpen(false)} order={order} />
    </div>
  )
}