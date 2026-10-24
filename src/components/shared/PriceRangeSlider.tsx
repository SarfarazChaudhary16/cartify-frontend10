import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'

export interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

/** Dual-thumb price range slider built from two overlapping native range inputs. */
export function PriceRangeSlider({ min, max, value, onChange, step = 100 }: PriceRangeSliderProps) {
  const [local, setLocal] = useState(value)

  useEffect(() => setLocal(value), [value])

  function handleMin(next: number) {
    const clamped = Math.min(next, local[1] - step)
    const updated: [number, number] = [clamped, local[1]]
    setLocal(updated)
    onChange(updated)
  }

  function handleMax(next: number) {
    const clamped = Math.max(next, local[0] + step)
    const updated: [number, number] = [local[0], clamped]
    setLocal(updated)
    onChange(updated)
  }

  const minPct = ((local[0] - min) / (max - min)) * 100
  const maxPct = ((local[1] - min) / (max - min)) * 100

  return (
    <div className="w-full">
      <div className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-porcelain-300 dark:bg-ink-700" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-cobalt-500"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[0]}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="range-thumb pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[1]}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="range-thumb pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent"
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-2 flex items-center justify-between price text-xs text-ink-600 dark:text-porcelain-300/70">
        <span>{formatPrice(local[0])}</span>
        <span>{formatPrice(local[1])}</span>
      </div>
    </div>
  )
}