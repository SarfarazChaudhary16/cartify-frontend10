import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect'
}

/** Shimmering placeholder block. Compose these to build any skeleton loading state. */
export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <span
      className={cn(
        'block animate-pulse bg-porcelain-300/70 dark:bg-ink-700/70',
        variant === 'text' && 'h-3.5 rounded-md',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-xl',
        className,
      )}
    />
  )
}

/** Convenience: a stack of text-line skeletons, e.g. for a paragraph placeholder. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
      ))}
    </div>
  )
}

/** Convenience: a product card skeleton — image + title + price, matches ProductCard layout. */
export function SkeletonProductCard() {
  return (
    <div className="surface-card overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-4/5" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}