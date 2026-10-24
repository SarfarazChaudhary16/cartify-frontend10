import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/** Generic empty state — used for empty cart, no search results, no orders, no notifications, etc. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/60">
        {icon ?? <PackageSearch className="h-7 w-7" />}
      </span>
      <h3 className="font-display text-xl font-medium text-ink-950 dark:text-porcelain-100">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-600 dark:text-porcelain-300/70">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  )
}