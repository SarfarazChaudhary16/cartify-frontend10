import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/utils'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'left' | 'right' | 'bottom'
  footer?: ReactNode
  widthClassName?: string
}

const sideVariants = {
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
}

const sidePositionClasses = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  bottom: 'bottom-0 left-0 w-full rounded-t-2xl',
}

/** Slide-in panel — used for cart drawer, filters drawer, mobile nav. */
export function Drawer({ open, onClose, title, children, side = 'right', footer, widthClassName = 'max-w-md' }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useClickOutside(panelRef, onClose, open)
  useEscapeKey(onClose, open)
  useLockBodyScroll(open)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={sideVariants[side]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute flex flex-col bg-white shadow-2xl dark:bg-ink-900',
              sidePositionClasses[side],
              side !== 'bottom' && `w-full ${widthClassName}`,
              side === 'bottom' && 'max-h-[85vh]',
            )}
          >
            {title && (
              <div className="flex shrink-0 items-center justify-between border-b border-porcelain-300 px-5 py-4 dark:border-ink-700">
                <h2 className="font-display text-lg font-medium text-ink-950 dark:text-porcelain-100">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-porcelain-200 dark:text-porcelain-300/70 dark:hover:bg-ink-800"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && <div className="shrink-0 border-t border-porcelain-300 px-5 py-4 dark:border-ink-700">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}