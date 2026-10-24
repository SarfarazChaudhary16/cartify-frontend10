import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { ChatWindow } from './components/ChatWindow'
import { useChatStore } from '@/store/useChatStore'
import { useChatUIStore } from '@/store/useChatUIStore'

/** Floating support chat, mounted once in RootLayout so it's available on every customer-facing page. */
export function FloatingChatWidget() {
  const open = useChatUIStore((s) => s.open)
  const minimized = useChatUIStore((s) => s.minimized)
  const fullScreen = useChatUIStore((s) => s.fullScreen)
  const openChat = useChatUIStore((s) => s.openChat)
  const closeChat = useChatUIStore((s) => s.closeChat)
  const toggleMinimize = useChatUIStore((s) => s.toggleMinimize)
  const toggleFullScreen = useChatUIStore((s) => s.toggleFullScreen)

  const messages = useChatStore((s) => s.messages)

  function handleToggleButton() {
    if (open && !minimized) {
      closeChat()
    } else {
      openChat()
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <ChatWindow
            minimized={minimized}
            fullScreen={fullScreen}
            onClose={closeChat}
            onToggleMinimize={toggleMinimize}
            onToggleFullScreen={toggleFullScreen}
          />
        )}
      </AnimatePresence>

      {!fullScreen && (
        <motion.button
          onClick={handleToggleButton}
          whileTap={{ scale: 0.92 }}
          aria-label={open && !minimized ? 'Close chat' : 'Open chat support'}
          className="fixed bottom-6 right-4 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-cobalt-500 text-white shadow-[0_8px_24px_-4px_rgba(52,84,255,0.5)] transition-colors hover:bg-cobalt-600 sm:right-6"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open && !minimized ? 'close' : 'chat'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {open && !minimized ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </motion.span>
          </AnimatePresence>
          {!open && messages.some((m) => m.sender !== 'user') && (
            <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-success-500 ring-2 ring-porcelain-100 dark:ring-ink-950" />
          )}
        </motion.button>
      )}
    </>
  )
}