import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>

export interface IconButtonProps extends NativeButtonProps {
  icon: ReactNode
  'aria-label': string
  variant?: Variant
  size?: Size
  /** Small numeric/dot badge, e.g. cart item count or unread notifications. */
  badge?: number | boolean
}

const variantClasses: Record<Variant, string> = {
  solid: 'bg-porcelain-200 text-ink-950 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-100 dark:hover:bg-ink-700',
  ghost: 'bg-transparent text-ink-950 dark:text-porcelain-100 hover:bg-ink-950/[0.05] dark:hover:bg-white/[0.06]',
  outline: 'border border-ink-950/15 dark:border-porcelain-100/20 text-ink-950 dark:text-porcelain-100 hover:bg-ink-950/[0.04] dark:hover:bg-white/5',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 w-9 rounded-lg [&_svg]:h-4 [&_svg]:w-4',
  md: 'h-11 w-11 rounded-xl [&_svg]:h-5 [&_svg]:w-5',
  lg: 'h-12 w-12 rounded-xl [&_svg]:h-5 [&_svg]:w-5',
}

/** Circular/square icon-only button — used for cart, wishlist, search, notification bell, theme toggle. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'ghost', size = 'md', badge, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.94 }}
        className={cn(
          'relative inline-flex items-center justify-center transition-colors duration-200',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon}
        {badge === true && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cobalt-500 ring-2 ring-porcelain-100 dark:ring-ink-950" />
        )}
        {typeof badge === 'number' && badge > 0 && (
          <span className="price absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-cobalt-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-porcelain-100 dark:ring-ink-950">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </motion.button>
    )
  },
)
IconButton.displayName = 'IconButton'