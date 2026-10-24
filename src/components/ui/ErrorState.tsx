import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

/** Generic error state — used when a page/section fails to load mock (or future API) data. */
export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-500/10 text-danger-500">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h3 className="font-display text-xl font-medium text-ink-950 dark:text-porcelain-100">{title}</h3>
      <p className="max-w-sm text-sm text-ink-600 dark:text-porcelain-300/70">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="h-4 w-4" />} className="mt-2">
          Try again
        </Button>
      )}
    </motion.div>
  )
}