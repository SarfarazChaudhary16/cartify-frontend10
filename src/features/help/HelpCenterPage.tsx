import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Mail, Phone, ChevronRight, LifeBuoy, ShieldCheck, Clock, Headset, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Accordion } from '@/components/shared/Accordion'
import { ContactOptionCard } from './components/ContactOptionCard'
import { AiChatWidget } from '@/features/chat/AiChatWidget'
import { useSupportTicketsStore, type TicketStatus } from '@/store/useSupportTicketsStore'
import { useAuthStore } from '@/store/useAuthStore'
import { helpFaqs, helpFaqCategories, type HelpFaqCategory } from '@/mocks/helpFaqs'
import { formatDate, cn } from '@/lib/utils'

const statusVariant: Record<TicketStatus, 'warning' | 'cobalt' | 'success'> = {
  open: 'warning',
  in_progress: 'cobalt',
  resolved: 'success',
}

export default function HelpCenterPage() {
  const [category, setCategory] = useState<HelpFaqCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)



  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const tickets = useSupportTicketsStore((s) => s.tickets)
  const fetchMyTickets = useSupportTicketsStore((s) => s.fetchMyTickets)

  useEffect(() => {
    if (isAuthenticated) fetchMyTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const myTickets = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [tickets],
  )

  const filtered = useMemo(() => {
    return helpFaqs.filter((f) => {
      const matchesCategory = category === 'all' || f.category === category
      const q = query.trim().toLowerCase()
      const matchesQuery = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div>
      <div className="bg-ink-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="font-display text-3xl font-medium text-porcelain-100 sm:text-4xl">How can we help?</h1>
          <p className="mt-2 text-sm text-porcelain-300/70">Find answers instantly, or reach our support team directly.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-porcelain-300/60">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Replies within 24 hours
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure & verified support
            </span>
            <span className="flex items-center gap-1.5">
              <Headset className="h-3.5 w-3.5" /> Real people, real answers
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* NAYA: Live Chat wapas aaya — ab real AI chatbot ke saath */}
          <ContactOptionCard
            icon={<Headset className="h-5 w-5" />}
            title="AI Chat"
            description="Get instant answers from our AI assistant."
            action={
              <Button size="sm" onClick={() => setChatOpen(true)}>
                Start Chat
              </Button>
            }
          />
          <ContactOptionCard
            icon={<FileText className="h-5 w-5" />}
            title="Raise a Ticket"
            description="Get help with a specific order or issue."
            action={
              <Link to="/help/ticket">
                <Button size="sm" variant="outline">Raise Ticket</Button>
              </Link>
            }
          />
          <ContactOptionCard
            icon={<Mail className="h-5 w-5" />}
            title="Email Us"
            description="support@cartify.example"
            action={
              <a href="mailto:support@cartify.example">
                <Button size="sm" variant="outline">Send Email</Button>
              </a>
            }
          />
          <ContactOptionCard
            icon={<Phone className="h-5 w-5" />}
            title="Call Us"
            description="Mon-Sat, 9am-7pm IST"
            action={
              <a href="tel:+911234567890">
                <Button size="sm" variant="outline">+91 12345 67890</Button>
              </a>
            }
          />
        </div>

        {isAuthenticated && myTickets.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl font-medium text-ink-950 dark:text-porcelain-100">My Tickets</h2>
            <div className="space-y-3">
              {myTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/help/tickets/${t.id}`)}
                  className="surface-card surface-card-lift flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cobalt-500/10 text-cobalt-500">
                      <LifeBuoy className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{t.subject}</p>
                      <p className="text-xs text-ink-600 dark:text-porcelain-300/60">#{t.ticketNumber} · {formatDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={statusVariant[t.status]} className="capitalize">{t.status.replace('_', ' ')}</Badge>
                    <ChevronRight className="h-4 w-4 text-ink-600 dark:text-porcelain-300/50" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Frequently Asked Questions</h2>
            <div className="w-full sm:w-64">
              <Input placeholder="Search FAQs…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategory('all')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                category === 'all'
                  ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                  : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
              )}
            >
              All
            </button>
            {helpFaqCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                  category === c.id
                    ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                    : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="surface-card mt-5 px-6">
            {filtered.length === 0 ? (
              <EmptyState title="No results" description="Try a different search term or browse another category." />
            ) : (
              <Accordion items={filtered.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AiChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}