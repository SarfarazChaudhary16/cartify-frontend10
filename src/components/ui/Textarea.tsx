import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
    const autoId = useId()
    const areaId = id ?? autoId

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            'w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-600/50',
            'dark:bg-ink-900 dark:text-porcelain-100 dark:placeholder:text-porcelain-300/40',
            'transition-colors duration-200 outline-none',
            error
              ? 'border-danger-500 focus:border-danger-500'
              : 'border-porcelain-300 focus:border-cobalt-500 dark:border-ink-700 dark:focus:border-cobalt-400',
            className,
          )}
          {...props}
        />
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger-500"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </motion.p>
          ) : helperText ? (
            <p className="mt-1.5 text-xs text-ink-600 dark:text-porcelain-300/60">{helperText}</p>
          ) : null}
        </AnimatePresence>
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'