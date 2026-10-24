import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Check, Paperclip } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useSupportTicketsStore, type TicketStatus } from '@/store/useSupportTicketsStore'
import { formatDate, cn } from '@/lib/utils'

const statusVariant: Record<TicketStatus, 'warning' | 'cobalt' | 'success'> = {
  open: 'warning',
  in_progress: 'cobalt',
  resolved: 'success',
}

export default function TicketDetailsPage() {
  const { ticketId } = useParams()
  const tickets = useSupportTicketsStore((s) => s.tickets)
  const fetchTicketById = useSupportTicketsStore((s) => s.fetchTicketById)

  const ticket = tickets.find((t) => t.id === ticketId)

  useEffect(() => {
    if (ticketId) fetchTicketById(ticketId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  if (!ticket) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Ticket not found" description="This ticket may not exist or has been removed." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/help/ticket" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-porcelain-300/70">
        <ChevronLeft className="h-4 w-4" /> Back to My Tickets
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">
            #{ticket.ticketNumber} · Raised on {formatDate(ticket.createdAt)}
          </p>
        </div>
        <Badge variant={statusVariant[ticket.status]} className="capitalize">{ticket.status.replace('_', ' ')}</Badge>
      </div>

      {/* Tracking Timeline — bilkul Order Tracking jaisa hi pattern:
          "Raised → In Progress → Resolved" */}
      <div className="surface-card mt-6 p-6">
        <h2 className="mb-5 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Progress</h2>
        <div className="space-y-0">
          {ticket.trackingSteps.map((step, i) => {
            const isLast = i === ticket.trackingSteps.length - 1
            return (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      step.completed ? 'bg-cobalt-500 text-white' : 'bg-porcelain-200 text-ink-400 dark:bg-ink-800 dark:text-porcelain-300/40',
                    )}
                  >
                    {step.completed ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                  </span>
                  {!isLast && <span className={cn('mt-1 h-12 w-0.5', step.completed ? 'bg-cobalt-500' : 'bg-porcelain-300 dark:bg-ink-700')} />}
                </div>
                <div className="pb-8">
                  <p className={cn('text-sm font-medium', step.completed ? 'text-ink-950 dark:text-porcelain-100' : 'text-ink-400 dark:text-porcelain-300/40')}>
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/50">{formatDate(step.timestamp)}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="surface-card mt-6 p-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Details</h2>
        <p className="text-sm text-ink-600 dark:text-porcelain-300/70">{ticket.description}</p>
        {ticket.orderNumber && (
          <p className="mt-3 text-xs text-ink-600 dark:text-porcelain-300/50">Related order: {ticket.orderNumber}</p>
        )}
        {ticket.attachmentUrl && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-600 dark:text-porcelain-300/60">
              <Paperclip className="h-3.5 w-3.5" /> Attachment
            </p>
            <img src={ticket.attachmentUrl} alt="Ticket attachment" className="max-h-64 rounded-xl object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}