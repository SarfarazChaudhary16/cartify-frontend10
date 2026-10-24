import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Maximize2, Minimize2, Send, Smile, Paperclip, Image as ImageIcon, Bot, Headset, Circle } from 'lucide-react'
import { ChatBubble } from './ChatBubble'
import { TypingIndicator } from './TypingIndicator'
import { EmojiPicker } from './EmojiPicker'
import { QuickReplies } from './QuickReplies'
import { EmptyState } from '@/components/ui/EmptyState'
import { useChatStore } from '@/store/useChatStore'
import { getBotReply, agentGreeting } from '@/lib/chatBotReplies'
import { quickReplies, suggestedFaqs } from '@/mocks/reviews'
import { cn } from '@/lib/utils'

export interface ChatWindowProps {
  minimized: boolean
  fullScreen: boolean
  onClose: () => void
  onToggleMinimize: () => void
  onToggleFullScreen: () => void
}

export function ChatWindow({ minimized, fullScreen, onClose, onToggleMinimize, onToggleFullScreen }: ChatWindowProps) {
  const messages = useChatStore((s) => s.messages)
  const mode = useChatStore((s) => s.mode)
  const addMessage = useChatStore((s) => s.addMessage)
  const setMode = useChatStore((s) => s.setMode)

  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [pendingAttachment, setPendingAttachment] = useState<{ type: 'image' | 'file'; url: string; name: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, minimized])

  function respondTo(userText: string) {
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      if (mode === 'agent') {
        addMessage({ sender: 'agent', text: "Got it — I'm checking that for you now, one moment." })
      } else if (/human|agent|person|representative/i.test(userText)) {
        setMode('agent')
        addMessage({ sender: 'ai', text: 'Connecting you to a live agent…' })
        window.setTimeout(() => addMessage({ sender: 'agent', text: agentGreeting }), 900)
      } else {
        addMessage({ sender: 'ai', text: getBotReply(userText) })
      }
    }, 900)
  }

  function handleSend(text?: string) {
    const content = (text ?? input).trim()
    if (!content && !pendingAttachment) return
    addMessage({ sender: 'user', text: content, attachments: pendingAttachment ? [pendingAttachment] : undefined })
    setInput('')
    setPendingAttachment(null)
    respondTo(content)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingAttachment({ type, url: URL.createObjectURL(file), name: file.name })
    e.target.value = ''
  }

  if (minimized) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col overflow-hidden bg-white shadow-2xl dark:bg-ink-900',
        fullScreen
          ? 'fixed inset-0 z-[200] rounded-none'
          : 'fixed bottom-24 right-4 z-[200] h-[560px] w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-porcelain-300 dark:border-ink-700 sm:right-6',
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-porcelain-300 bg-ink-950 px-4 py-3 dark:border-ink-700">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
            {mode === 'ai' ? <Bot className="h-[18px] w-[18px]" /> : <Headset className="h-[18px] w-[18px]" />}
          </span>
          <div>
            <p className="text-sm font-medium text-white">{mode === 'ai' ? 'Cartify AI Assistant' : 'Priya · Live Agent'}</p>
            <p className="flex items-center gap-1 text-xs text-porcelain-300/70">
              <Circle className="h-2 w-2 fill-success-500 text-success-500" /> Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onToggleFullScreen} aria-label={fullScreen ? 'Exit full screen' : 'Full screen'} className="rounded-lg p-1.5 text-white/80 hover:bg-white/10">
            {fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button onClick={onToggleMinimize} aria-label="Minimize" className="rounded-lg p-1.5 text-white/80 hover:bg-white/10">
            <Minus className="h-4 w-4" />
          </button>
          <button onClick={onClose} aria-label="Close chat" className="rounded-lg p-1.5 text-white/80 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <EmptyState title="Start a conversation" description="Ask about orders, returns, sizing, or anything else." />
        ) : (
          messages.map((m) => <ChatBubble key={m.id} message={m} />)
        )}
        {typing && <TypingIndicator />}

        {messages.length <= 3 && !typing && (
          <div className="space-y-3 pt-1">
            <QuickReplies items={quickReplies} onPick={(t) => handleSend(t)} />
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/50">Suggested FAQs</p>
              <div className="space-y-1.5">
                {suggestedFaqs.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="block w-full rounded-lg bg-porcelain-100 px-3 py-2 text-left text-xs text-ink-700 transition-colors hover:bg-porcelain-200 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-porcelain-300 p-3 dark:border-ink-700">
        {pendingAttachment && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-porcelain-100 px-3 py-1.5 text-xs text-ink-700 dark:bg-ink-800 dark:text-porcelain-200">
            {pendingAttachment.type === 'image' ? <ImageIcon className="h-3.5 w-3.5" /> : <Paperclip className="h-3.5 w-3.5" />}
            <span className="flex-1 truncate">{pendingAttachment.name}</span>
            <button onClick={() => setPendingAttachment(null)} className="text-ink-600 dark:text-porcelain-300/60">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <div className="relative flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => setEmojiOpen((v) => !v)}
              aria-label="Emoji picker"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800"
            >
              <Smile className="h-[18px] w-[18px]" />
            </button>
            <EmojiPicker open={emojiOpen} onClose={() => setEmojiOpen(false)} onSelect={(e) => setInput((v) => v + e)} />
          </div>

          <button
            onClick={() => imageInputRef.current?.click()}
            aria-label="Attach image"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800"
          >
            <ImageIcon className="h-[18px] w-[18px]" />
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e, 'image')} />

          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800"
          >
            <Paperclip className="h-[18px] w-[18px]" />
          </button>
          <input ref={fileInputRef} type="file" hidden onChange={(e) => handleFile(e, 'file')} />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message…"
            className="h-9 flex-1 rounded-lg bg-porcelain-100 px-3 text-sm text-ink-950 outline-none placeholder:text-ink-600/50 dark:bg-ink-800 dark:text-porcelain-100 dark:placeholder:text-porcelain-300/40"
          />

          <button
            onClick={() => handleSend()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cobalt-500 text-white transition-colors hover:bg-cobalt-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}