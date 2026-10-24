import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4' }

/** Read-only star rating with optional review count, e.g. "★★★★☆ (328)". */
export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.min(1, Math.max(0, value - (i - 1)))
          return (
            <span key={i} className="relative inline-block">
              <Star className={cn(sizeClasses[size], 'text-porcelain-300 dark:text-ink-700')} fill="currentColor" />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star className={cn(sizeClasses[size], 'text-gold-500')} fill="currentColor" />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {count !== undefined && (
        <span className="price text-xs text-ink-600 dark:text-porcelain-300/70">({count.toLocaleString('en-IN')})</span>
      )}
    </div>
  )
}