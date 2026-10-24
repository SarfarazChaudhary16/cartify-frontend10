import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send, Loader2, MessageCircle, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/apiClient'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AiChatWidgetProps {
  open: boolean
  onClose: () => void
}

export function AiChatWidget({ open, onClose }: AiChatWidgetProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi${user ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm Cartify's AI assistant. I can help you with order tracking, returns, product questions, and more. What can I help you with today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await apiClient.post<{ reply: string; action?: string }>('/ai/chat', {
        messages: updatedMessages,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.reply,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Agar AI ne kaha "raise a ticket" — automatically redirect karo
      if (response.data.action === 'redirect:/help/ticket') {
        setTimeout(() => {
          onClose()
          navigate('/help/ticket')
        }, 1500)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-porcelain-300 bg-white shadow-2xl dark:border-ink-700 dark:bg-ink-900"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-porcelain-300 bg-cobalt-500 px-4 py-3 dark:border-ink-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Cartify Assistant</p>
              <p className="text-xs text-white/70">Powered by AI · Always here to help</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt-500/10 text-cobalt-500">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-cobalt-500 text-white rounded-tr-sm'
                      : 'bg-porcelain-100 text-ink-950 rounded-tl-sm dark:bg-ink-800 dark:text-porcelain-100',
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt-500/10 text-cobalt-500">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-porcelain-100 px-4 py-3 dark:bg-ink-800">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 dark:bg-porcelain-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 dark:bg-porcelain-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 dark:bg-porcelain-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-porcelain-300 px-3 py-3 dark:border-ink-700">
            <div className="flex items-center gap-2 rounded-xl border border-porcelain-300 bg-porcelain-50 px-3 py-2 dark:border-ink-700 dark:bg-ink-800">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-sm text-ink-950 outline-none placeholder:text-ink-400 dark:text-porcelain-100 dark:placeholder:text-porcelain-300/40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cobalt-500 text-white transition-colors hover:bg-cobalt-600 disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-ink-400 dark:text-porcelain-300/40">
              AI can make mistakes · For urgent help, raise a ticket
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}