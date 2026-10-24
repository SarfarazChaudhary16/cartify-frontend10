import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItemData {
  id: string
  question: string
  answer: ReactNode
}

/** Single-expand FAQ-style accordion. Generic — reused wherever a Q&A list appears. */
export function Accordion({ items, className }: { items: AccordionItemData[]; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className={cn('divide-y divide-porcelain-300 dark:divide-ink-700', className)}>
      {items.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{item.question}</span>
              <Plus className={cn('h-4 w-4 shrink-0 text-ink-600 transition-transform duration-200 dark:text-porcelain-300/60', open && 'rotate-45')} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pt-2.5 text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}