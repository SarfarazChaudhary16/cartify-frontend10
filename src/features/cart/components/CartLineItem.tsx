import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import type { CartItem } from '@/types'

// NOTE: "compact" prop aur "Save for later" button poori tarah hataye
// gaye — backend mein ye concept exist nahi karta
export function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <div className="flex gap-3 py-4">
      <img src={item.image} alt={item.title} className="h-24 w-24 shrink-0 rounded-xl object-cover" />

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">{item.title}</p>
        {(item.color || item.size) && (
          <p className="mt-0.5 text-xs text-ink-600 dark:text-porcelain-300/60">
            {[item.color, item.size].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="price mt-1 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{formatPrice(item.price)}</p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-porcelain-300 dark:border-ink-700">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center text-ink-950 dark:text-porcelain-100"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="price w-6 text-center text-xs font-medium text-ink-950 dark:text-porcelain-100">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center text-ink-950 dark:text-porcelain-100"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        aria-label="Remove item"
        className="h-fit rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}