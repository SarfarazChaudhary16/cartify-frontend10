import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { CartLineItem } from './components/CartLineItem'
import { CouponGiftCardBox } from './components/CouponGiftCardBox'
import { OrderSummary } from './components/OrderSummary'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/useCartStore'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const fetchCart = useCartStore((s) => s.fetchCart)

  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that."
          action={
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Shopping Cart</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="surface-card divide-y divide-porcelain-300 px-5 dark:divide-ink-700">
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </div>

          {/* NOTE: "Saved for later" section hataya gaya — backend
              CartItem entity mein ye concept support nahi hota */}

          <div className="mt-6">
            <CouponGiftCardBox />
          </div>
        </div>

        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}