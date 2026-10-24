import { MapPin, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import type { Address } from '@/types'
import type { ShippingOption } from './ShippingStep'
import type { PaymentMethodId } from './PaymentStep'

const paymentLabels: Record<PaymentMethodId, string> = {
  upi: 'UPI',
  card: 'Credit/Debit Card',
  wallet: 'Wallet',
  cod: 'Cash on Delivery',
  netbanking: 'Net Banking',
}

export interface ReviewStepProps {
  address: Address
  shipping: ShippingOption
  paymentMethod: PaymentMethodId
  onBack: () => void
  onPlaceOrder: () => void
  placing: boolean
}

export function ReviewStep({ address, shipping, paymentMethod, onBack, onPlaceOrder, placing }: ReviewStepProps) {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const couponDiscount = useCartStore((s) => s.couponDiscount())
  // NAYA: giftCardCredit poori tarah hataya — store mein ab exist nahi
  // karta (Gift Card feature poori tarah hataya gaya tha)
  const total = subtotal - couponDiscount + shipping.fee

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink-950 dark:text-porcelain-100">Review Your Order</h2>

      <div className="space-y-4">
        <div className="surface-card flex items-start gap-3 p-4">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cobalt-500" />
          <div className="text-sm">
            <p className="font-semibold text-ink-950 dark:text-porcelain-100">{address.fullName}</p>
            <p className="text-ink-600 dark:text-porcelain-300/70">
              {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.pincode}
            </p>
            <p className="text-ink-600 dark:text-porcelain-300/70">{address.phone}</p>
          </div>
        </div>

        <div className="surface-card flex items-center gap-3 p-4">
          <Truck className="h-4 w-4 shrink-0 text-cobalt-500" />
          <p className="text-sm text-ink-950 dark:text-porcelain-100">
            {shipping.label} <span className="text-ink-600 dark:text-porcelain-300/60">({shipping.description})</span>
          </p>
        </div>

        <div className="surface-card flex items-center gap-3 p-4">
          <CreditCard className="h-4 w-4 shrink-0 text-cobalt-500" />
          <p className="text-sm text-ink-950 dark:text-porcelain-100">{paymentLabels[paymentMethod]}</p>
        </div>

        <div className="surface-card p-4">
          <p className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Items ({items.length})</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-950 dark:text-porcelain-100">{item.title}</p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Qty {item.quantity}</p>
                </div>
                <span className="price text-sm font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-porcelain-300 dark:border-ink-700" />

          <div className="flex justify-between text-base font-semibold text-ink-950 dark:text-porcelain-100">
            <span>Total</span>
            <span className="price">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={placing}>Back</Button>
        <Button size="lg" onClick={onPlaceOrder} loading={placing}>
          Place Order
        </Button>
      </div>
    </div>
  )
}