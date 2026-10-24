import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export interface PriceTagProps {
  price: number
  compareAtPrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: { price: 'text-sm', compare: 'text-xs' },
  md: { price: 'text-base', compare: 'text-sm' },
  lg: { price: 'text-2xl', compare: 'text-base' },
}

/**
 * Cartify's signature price display: current price in tabular mono, with a
 * struck-through compare-at price and a rounded discount badge when on sale.
 */
export function PriceTag({ price, compareAtPrice, size = 'md', className }: PriceTagProps) {
  const discount = compareAtPrice && compareAtPrice > price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('price font-semibold text-ink-950 dark:text-porcelain-100', sizeClasses[size].price)}>
        {formatPrice(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className={cn('price text-ink-600/60 line-through dark:text-porcelain-300/40', sizeClasses[size].compare)}>
          {formatPrice(compareAtPrice)}
        </span>
      )}
      {discount && (
        <span className="price rounded-md bg-success-500/10 px-1.5 py-0.5 text-xs font-semibold text-success-500">
          {discount}% off
        </span>
      )}
    </div>
  )
}