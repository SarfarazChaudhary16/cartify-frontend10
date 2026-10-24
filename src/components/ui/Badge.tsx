import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'neutral' | 'cobalt' | 'gold' | 'success' | 'danger' | 'warning'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  neutral: 'bg-porcelain-200 text-ink-700 dark:bg-ink-800 dark:text-porcelain-200',
  cobalt: 'bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400',
  gold: 'bg-gold-500/15 text-gold-600 dark:text-gold-400',
  success: 'bg-success-500/10 text-success-500',
  danger: 'bg-danger-500/10 text-danger-500',
  warning: 'bg-warning-500/15 text-[#8a5f16] dark:text-warning-500',
}

/** Small pill label — used for "New", "Best Seller", discount %, order status, category tags. */
export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}