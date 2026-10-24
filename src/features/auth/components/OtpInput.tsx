import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

export function OtpInput({
  length = 6,
  onComplete,
  error,
  theme = 'auto',
}: {
  length?: number
  onComplete: (code: string) => void
  error?: string
  /** 'dark' forces dark-panel-friendly styling regardless of the app's light/dark toggle — used on the always-dark Admin auth pages. */
  theme?: 'auto' | 'dark'
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function updateValue(index: number, digit: string) {
    const next = [...values]
    next[index] = digit
    setValues(next)
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus()
    if (next.every((v) => v !== '')) onComplete(next.join(''))
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = Array(length).fill('')
    pasted.split('').forEach((d, i) => (next[i] = d))
    setValues(next)
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus()
    if (pasted.length === length) onComplete(pasted)
  }

  return (
    <div>
      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            value={v}
            onChange={(e) => updateValue(i, e.target.value.replace(/\D/g, '').slice(-1))}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className={cn(
              'h-12 w-11 rounded-xl border text-center text-lg font-semibold outline-none transition-colors',
              theme === 'dark'
                ? cn('bg-white/5 text-porcelain-100', error ? 'border-danger-500' : 'border-white/15 focus:border-cobalt-400')
                : cn(
                    'text-ink-950 dark:bg-ink-900 dark:text-porcelain-100',
                    error ? 'border-danger-500' : 'border-porcelain-300 focus:border-cobalt-500 dark:border-ink-700 dark:focus:border-cobalt-400',
                  ),
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-center text-xs font-medium text-danger-500">{error}</p>}
    </div>
  )
}