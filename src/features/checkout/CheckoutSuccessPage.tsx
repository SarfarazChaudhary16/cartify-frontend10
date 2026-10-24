import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useProductsStore } from '@/store/useProductsStore'
import { formatDate, formatPrice, getEstimatedDelivery } from '@/lib/utils'

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')

  const order = useOrdersStore((s) => (orderId ? s.getOrder(orderId) : undefined))
  const fetchOrder = useOrdersStore((s) => s.fetchOrder)
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)

  const delivery = useMemo(() => getEstimatedDelivery(), [])

  useEffect(() => {
    // Normal flow mein order already store mein hoga (placeOrder() ne
    // ise turant prepend kiya tha). Lekin agar user seedha ye page
    // REFRESH kar de (store khaali ho jaye), safety ke taur pe fetch
    // bhi kar lete hain.
    if (orderId && !order) fetchOrder(orderId)
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="No recent order found"
          description="Place an order to see your confirmation here."
          action={
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-500/10 text-success-500"
      >
        <CheckCircle2 className="h-10 w-10" />
      </motion.span>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <h1 className="mt-6 font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-ink-600 dark:text-porcelain-300/70">
          Thank you — your order <span className="price font-medium text-ink-950 dark:text-porcelain-100">#{order.orderNumber}</span> has been placed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="surface-card mt-8 p-6 text-left"
      >
        <div className="flex items-center gap-3 border-b border-porcelain-300 pb-4 dark:border-ink-700">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-500">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Estimated delivery</p>
            <p className="price text-sm text-ink-600 dark:text-porcelain-300/70">{delivery.start} – {delivery.end}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-4">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-600 dark:text-porcelain-300/60" />
          <p className="text-sm text-ink-600 dark:text-porcelain-300/70">
            {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
          </p>
        </div>

        <div className="space-y-3 border-t border-porcelain-300 pt-4 dark:border-ink-700">
          {order.items.map((item, i) => {
            // NAYA: getProductById() (mock function) hataya — ab REAL
            // catalog (useProductsStore) mein dhoondhte hain, taaki "View
            // Product" link sahi jagah le jaye
            const product = products.find((p) => p.id === item.productId)
            const itemContent = (
              <>
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-950 dark:text-porcelain-100">{item.title}</p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Qty {item.quantity}</p>
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
                <span className="price shrink-0 text-sm font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(item.price * item.quantity)}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex justify-between border-t border-porcelain-300 pt-4 text-base font-semibold text-ink-950 dark:border-ink-700 dark:text-porcelain-100">
          <span>Total Paid</span>
          <span className="price">{formatPrice(order.total)}</span>
        </div>

        <p className="mt-2 text-xs text-ink-600 dark:text-porcelain-300/50">Placed on {formatDate(order.placedAt)}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"
      >
        <Link to={`/account/orders/${order.id}`}>
          <Button variant="outline" className="w-full sm:w-auto">Track Order</Button>
        </Link>
        <Link to="/">
          <Button className="w-full sm:w-auto" leftIcon={<Home className="h-4 w-4" />}>
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}