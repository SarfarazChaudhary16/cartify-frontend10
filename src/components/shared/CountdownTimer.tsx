import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

/** Countdown to a target Date. Used by the Flash Sale banner. Re-renders every second. */
export function CountdownTimer({ target, className }: { target: Date; className?: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target.getTime()))

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target.getTime())), 1000)
    return () => clearInterval(id)
  }, [target])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {[
        { label: 'H', value: remaining.hours },
        { label: 'M', value: remaining.minutes },
        { label: 'S', value: remaining.seconds },
      ].map((unit, i) => (
        <span key={unit.label} className="flex items-center gap-1.5">
          <span className="price flex h-9 min-w-9 items-center justify-center rounded-lg bg-ink-950 px-1.5 text-sm font-semibold text-white dark:bg-white dark:text-ink-950">
            {pad(unit.value)}
          </span>
          {i < 2 && <span className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">:</span>}
        </span>
      ))}
    </div>
  )
}