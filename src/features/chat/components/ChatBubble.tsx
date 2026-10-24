import { motion } from 'framer-motion'
import { Paperclip } from 'lucide-react'
import { formatTime, cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'rounded-br-sm bg-cobalt-500 text-white'
            : 'rounded-bl-sm bg-porcelain-200 text-ink-950 dark:bg-ink-800 dark:text-porcelain-100',
        )}
      >
        {message.attachments?.map((a, i) =>
          a.type === 'image' ? (
            <img key={i} src={a.url} alt={a.name} className="mb-1.5 max-h-40 rounded-lg" />
          ) : (
            <div key={i} className={cn('mb-1.5 flex items-center gap-1.5 text-xs underline underline-offset-2', isUser ? 'text-white/90' : 'text-ink-700 dark:text-porcelain-200')}>
              <Paperclip className="h-3 w-3 shrink-0" /> {a.name}
            </div>
          ),
        )}
        {message.text && <p className="leading-relaxed">{message.text}</p>}
        <p className={cn('mt-1 text-[10px]', isUser ? 'text-white/70' : 'text-ink-600 dark:text-porcelain-300/50')}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}