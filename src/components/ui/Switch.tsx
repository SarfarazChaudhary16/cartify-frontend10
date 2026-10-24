import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

/** Toggle switch — used for settings, notification preferences, filter shortcuts. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ label, className, id, checked, ...props }, ref) => {
  const autoId = useId()
  const switchId = id ?? autoId
  return (
    <label htmlFor={switchId} className={cn('inline-flex cursor-pointer items-center gap-2.5 select-none', className)}>
      <span
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-cobalt-500' : 'bg-porcelain-300 dark:bg-ink-700',
        )}
      >
        <input ref={ref} type="checkbox" id={switchId} checked={checked} className="peer sr-only" {...props} />
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="h-[18px] w-[18px] rounded-full bg-white shadow-sm"
          style={{ marginLeft: checked ? 'calc(100% - 18px - 3px)' : '3px' }}
        />
      </span>
      {label && <span className="text-sm text-ink-950 dark:text-porcelain-100">{label}</span>}
    </label>
  )
})
Switch.displayName = 'Switch'