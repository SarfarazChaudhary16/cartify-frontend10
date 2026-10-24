import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/** Text input with label, helper text, and an animated error message. Validation-ready. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600 dark:text-porcelain-300/60">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'h-11 w-full rounded-xl border bg-white px-4 text-sm text-ink-950 placeholder:text-ink-600/50',
              'dark:bg-ink-900 dark:text-porcelain-100 dark:placeholder:text-porcelain-300/40',
              'transition-colors duration-200 outline-none',
              error
                ? 'border-danger-500 focus:border-danger-500'
                : 'border-porcelain-300 focus:border-cobalt-500 dark:border-ink-700 dark:focus:border-cobalt-400',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              className,
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-600 dark:text-porcelain-300/60">{rightIcon}</span>}
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger-500"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </motion.p>
          ) : helperText ? (
            <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-ink-600 dark:text-porcelain-300/60">
              {helperText}
            </p>
          ) : null}
        </AnimatePresence>
      </div>
    )
  },
)
Input.displayName = 'Input'