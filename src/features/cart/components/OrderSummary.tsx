import { Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice, getEstimatedDelivery } from '@/lib/utils'

export function OrderSummary() {
  const itemCount = useCartStore((s) => s.itemCount())
  const subtotal = useCartStore((s) => s.subtotal())
  const couponDiscount = useCartStore((s) => s.couponDiscount())
  const shippingFee = useCartStore((s) => s.shippingFee())
  const total = useCartStore((s) => s.total())
  const delivery = getEstimatedDelivery()

  return (
    <div className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Order Summary</h2>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-ink-600 dark:text-porcelain-300/70">
          <span>Subtotal ({itemCount} items)</span>
          <span className="price text-ink-950 dark:text-porcelain-100">{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-success-500">
            <span>Coupon discount</span>
            <span className="price">-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink-600 dark:text-porcelain-300/70">
          <span>Shipping</span>
          <span className="price text-ink-950 dark:text-porcelain-100">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
        </div>
      </div>

      <div className="my-4 border-t border-porcelain-300 dark:border-ink-700" />

      <div className="flex justify-between text-base font-semibold text-ink-950 dark:text-porcelain-100">
        <span>Total</span>
        <span className="price">{formatPrice(total)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-cobalt-500/5 px-3.5 py-3 text-xs text-cobalt-600 dark:text-cobalt-400">
        <Truck className="h-4 w-4 shrink-0" />
        Estimated delivery: <span className="price font-medium">{delivery.start} – {delivery.end}</span>
      </div>

      <Link to="/checkout">
        <Button size="lg" className="mt-5 w-full" disabled={itemCount === 0}>
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  )
}