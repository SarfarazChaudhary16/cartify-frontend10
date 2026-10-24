import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, className, id, checked, ...props }, ref) => {
  const autoId = useId()
  const boxId = id ?? autoId
  return (
    <label htmlFor={boxId} className={cn('inline-flex cursor-pointer items-center gap-2.5 select-none', className)}>
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input ref={ref} type="checkbox" id={boxId} checked={checked} className="peer sr-only" {...props} />
        <span
          className={cn(
            'h-5 w-5 rounded-md border-2 transition-colors duration-150',
            checked
              ? 'border-cobalt-500 bg-cobalt-500'
              : 'border-porcelain-300 bg-white dark:border-ink-700 dark:bg-ink-900 peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt-500 peer-focus-visible:ring-offset-2',
          )}
        />
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-white"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </motion.span>
      </span>
      {label && <span className="text-sm text-ink-950 dark:text-porcelain-100">{label}</span>}
    </label>
  )
})
Checkbox.displayName = 'Checkbox'