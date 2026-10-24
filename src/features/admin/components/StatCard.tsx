import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function StatCard({ label, value, delta, icon }: { label: string; value: string; delta?: number; icon: ReactNode }) {
  const positive = (delta ?? 0) >= 0

  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-500">{icon}</span>
        {delta !== undefined && (
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              positive ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500',
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="price mt-4 text-2xl font-semibold text-ink-950 dark:text-porcelain-100">{value}</p>
      <p className="mt-1 text-xs text-ink-600 dark:text-porcelain-300/60">{label}</p>
    </div>
  )
}