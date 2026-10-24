import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CartLineItem } from '@/features/cart/components/CartLineItem'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'

/** Quick-access cart drawer opened from the header icon — full page with coupons lives at /cart. */
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCartStore((s) => s.items)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const subtotal = useCartStore((s) => s.subtotal())
  const itemCount = useCartStore((s) => s.itemCount())

  // Jab drawer khule, cart ko REFRESH kar lete hain — taaki agar
  // kisi doosre tab/page se cart change hua ho, ye hamesha latest dikhaye
  useEffect(() => {
    if (open) fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      title={`Your Cart${itemCount ? ` (${itemCount})` : ''}`}
      footer={
        items.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-ink-950 dark:text-porcelain-100">
              <span>Subtotal</span>
              <span className="price">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex gap-2.5">
              <Link to="/cart" onClick={onClose} className="flex-1">
                <Button variant="outline" className="w-full">View Cart</Button>
              </Link>
              <Link to="/checkout" onClick={onClose} className="flex-1">
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState icon={<ShoppingBag className="h-7 w-7" />} title="Your cart is empty" description="Add something you love." />
      ) : (
        <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </Drawer>
  )
}