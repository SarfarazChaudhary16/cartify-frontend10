import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>

export interface ButtonProps extends NativeButtonProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-cobalt-500 text-white hover:bg-cobalt-600 active:bg-cobalt-700 shadow-[0_8px_20px_-6px_rgba(52,84,255,0.5)]',
  secondary:
    'bg-porcelain-200 text-ink-950 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-100 dark:hover:bg-ink-700',
  outline:
    'border border-ink-950/15 dark:border-porcelain-100/20 text-ink-950 dark:text-porcelain-100 hover:bg-ink-950/[0.04] dark:hover:bg-white/5 bg-transparent',
  ghost: 'bg-transparent text-ink-950 dark:text-porcelain-100 hover:bg-ink-950/[0.05] dark:hover:bg-white/[0.06]',
  danger: 'bg-danger-500 text-white hover:bg-[#c73a3f] shadow-[0_8px_20px_-6px_rgba(229,72,77,0.45)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-7 text-base gap-2 rounded-xl',
}

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

/**
 * Primary button primitive. Includes a lightweight ripple on click and a
 * loading state that swaps content for a spinner without shifting layout.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, leftIcon, rightIcon, className, children, disabled, onPointerDown, ...props },
    ref,
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([])

    function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
      const rect = e.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const id = Date.now()
      setRipples((r) => [...r, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }])
      window.setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600)
      onPointerDown?.(e)
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        onPointerDown={handlePointerDown}
        disabled={disabled || loading}
        className={cn(
          'relative isolate inline-flex select-none items-center justify-center overflow-hidden font-medium',
          'transition-colors duration-200 ease-[var(--ease-premium)]',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                initial={{ opacity: 0.35, scale: 0 }}
                animate={{ opacity: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute rounded-full bg-white/60"
                style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
              />
            ))}
          </AnimatePresence>
        </span>

        <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>

        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'
