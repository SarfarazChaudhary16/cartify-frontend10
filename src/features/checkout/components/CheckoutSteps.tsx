import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CheckoutStep = 'address' | 'shipping' | 'payment' | 'review'

const steps: { id: CheckoutStep; label: string }[] = [
  { id: 'address', label: 'Address' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

export function CheckoutSteps({ current }: { current: CheckoutStep }) {
  const currentIndex = steps.findIndex((s) => s.id === current)

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const completed = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  completed && 'bg-cobalt-500 text-white',
                  active && 'bg-cobalt-500 text-white ring-4 ring-cobalt-500/20',
                  !completed && !active && 'bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/60',
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  active || completed ? 'text-ink-950 dark:text-porcelain-100' : 'text-ink-600 dark:text-porcelain-300/60',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-porcelain-200 dark:bg-ink-800">
                <motion.div
                  initial={false}
                  animate={{ width: i < currentIndex ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-cobalt-500"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}