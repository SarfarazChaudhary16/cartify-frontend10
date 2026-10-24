import { Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { formatOrderStatus } from '@/lib/orderStatus'
import type { Order } from '@/types'
import { cn } from '@/lib/utils'

export function OrderTrackingTimeline({ steps }: { steps: Order['trackingSteps'] }) {
  return (
    <div>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                step.completed ? 'bg-cobalt-500 text-white' : 'bg-porcelain-200 text-ink-400 dark:bg-ink-800 dark:text-porcelain-300/40',
              )}
            >
              {step.completed ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            {i < steps.length - 1 && (
              <span className={cn('mt-1 w-0.5 flex-1', step.completed ? 'bg-cobalt-500' : 'bg-porcelain-200 dark:bg-ink-800')} style={{ minHeight: 32 }} />
            )}
          </div>
          <div className={cn('pb-6', !step.completed && 'opacity-50')}>
            <p className="text-sm font-medium capitalize text-ink-950 dark:text-porcelain-100">{step.label || formatOrderStatus(step.status)}</p>
            {step.timestamp && <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{formatDate(step.timestamp)}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}