import { Check, Truck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice, cn } from '@/lib/utils'

export interface ShippingOption {
  id: 'standard' | 'express'
  label: string
  description: string
  fee: number
  icon: typeof Truck
}

export const shippingOptions: ShippingOption[] = [
  { id: 'standard', label: 'Standard Delivery', description: '5-7 business days', fee: 0, icon: Truck },
  { id: 'express', label: 'Express Delivery', description: '2-3 business days', fee: 99, icon: Zap },
]

export interface ShippingStepProps {
  selected: ShippingOption['id']
  onSelect: (id: ShippingOption['id']) => void
  onNext: () => void
  onBack: () => void
}

export function ShippingStep({ selected, onSelect, onNext, onBack }: ShippingStepProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink-950 dark:text-porcelain-100">Shipping Method</h2>

      <div className="space-y-3">
        {shippingOptions.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors',
                active ? 'border-cobalt-500 bg-cobalt-500/5' : 'border-porcelain-300 dark:border-ink-700',
              )}
            >
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', active ? 'bg-cobalt-500 text-white' : 'bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/60')}>
                <opt.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">{opt.label}</p>
                <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{opt.description}</p>
              </div>
              <span className="price text-sm font-semibold text-ink-950 dark:text-porcelain-100">
                {opt.fee === 0 ? 'Free' : formatPrice(opt.fee)}
              </span>
              {active && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cobalt-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button size="lg" onClick={onNext}>Continue to Payment</Button>
      </div>
    </div>
  )
}