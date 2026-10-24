import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'

const emojis = ['😀', '😂', '😍', '👍', '🙏', '🎉', '😢', '😡', '❤️', '🔥', '👀', '✅', '❓', '📦', '🚚', '💳', '😅', '🤔', '👋', '🙌']

export function EmojiPicker({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (emoji: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClose, open)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full left-0 mb-2 grid grid-cols-5 gap-1 rounded-xl border border-porcelain-300 bg-white p-2 shadow-xl dark:border-ink-700 dark:bg-ink-900"
        >
          {emojis.map((e) => (
            <button
              key={e}
              onClick={() => {
                onSelect(e)
                onClose()
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors hover:bg-porcelain-100 dark:hover:bg-ink-800"
            >
              {e}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}