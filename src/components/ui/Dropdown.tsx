import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { cn } from '@/lib/utils'

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}
const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('Dropdown.* components must be used inside <Dropdown>')
  return ctx
}

export function Dropdown({ children, className }: { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)
  useEscapeKey(() => setOpen(false), open)

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownTrigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useDropdownContext()
  return (
    <div onClick={() => setOpen(!open)} aria-expanded={open} className="cursor-pointer">
      {children}
    </div>
  )
}

export function DropdownPanel({ children, align = 'end', className }: { children: ReactNode; align?: 'start' | 'end'; className?: string }) {
  const { open } = useDropdownContext()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'absolute top-full z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-porcelain-300 bg-white py-1.5 shadow-xl dark:border-ink-700 dark:bg-ink-900',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DropdownItem({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const { setOpen } = useDropdownContext()
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
      className={cn(
        'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink-950 transition-colors hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * Same visual treatment as DropdownItem, but renders as a react-router <Link>
 * so it's valid to use for navigation (never nest an <a> inside a <button>).
 */
export function DropdownLinkItem({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  const { setOpen } = useDropdownContext()
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={cn(
        'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink-950 transition-colors hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800',
        className,
      )}
    >
      {children}
    </Link>
  )
}