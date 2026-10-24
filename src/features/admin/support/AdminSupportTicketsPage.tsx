import { useEffect, useMemo, useState } from 'react'
import { LifeBuoy, Search, Paperclip, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { useAdminSupportTicketsStore } from '@/store/useAdminSupportTicketsStore'
import type { TicketStatus } from '@/store/useSupportTicketsStore'
import { useToast } from '@/components/ui/Toast'
import { formatDate, cn } from '@/lib/utils'

const statusVariant: Record<TicketStatus, 'warning' | 'cobalt' | 'success'> = {
  open: 'warning',
  in_progress: 'cobalt',
  resolved: 'success',
}

const statusOptions: TicketStatus[] = ['open', 'in_progress', 'resolved']

export default function AdminSupportTicketsPage() {
  const tickets = useAdminSupportTicketsStore((s) => s.tickets)
  const fetchAllTickets = useAdminSupportTicketsStore((s) => s.fetchAllTickets)
  const updateStatus = useAdminSupportTicketsStore((s) => s.updateStatus)
  const { toast } = useToast()

  useEffect(() => {
    fetchAllTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  // NAYA: Image ko ab NEW-TAB ki jagah IN-APP modal (lightbox) mein
  // dikhate hain — jismein proper "X" close-button hota hai, aur
  // browser ka native image-viewer (magnifier-cursor, no-back-button)
  // kabhi trigger hi nahi hota
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        t.subject.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q) ||
        t.userEmail?.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [tickets, query, statusFilter])

  async function handleStatusChange(ticketId: string, status: TicketStatus) {
    try {
      await updateStatus(ticketId, status)
      toast({ type: 'success', title: 'Ticket status updated' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Support Tickets</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{tickets.length} total tickets</p>
        </div>
        <div className="w-full sm:w-72">
          <Input placeholder="Search subject, customer, ticket number…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(['all', ...statusOptions] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 text-sm font-medium capitalize transition-colors',
              statusFilter === s
                ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
            )}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="surface-card mt-5">
        {filtered.length === 0 ? (
          <EmptyState icon={<LifeBuoy className="h-7 w-7" />} title="No tickets found" description="Try a different filter or search term." />
        ) : (
          <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
            {filtered.map((t) => (
              <div key={t.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">{t.subject}</p>
                    <Badge variant={statusVariant[t.status]} className="capitalize">{t.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-600 dark:text-porcelain-300/60">
                    #{t.ticketNumber} · {t.category} {t.orderNumber ? `· Order ${t.orderNumber}` : ''} · {formatDate(t.createdAt)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-cobalt-600 dark:text-cobalt-400">
                    {t.userName} · {t.userEmail}
                  </p>
                  <p className="mt-2 text-sm text-ink-600 dark:text-porcelain-300/70">{t.description}</p>

                  {/* NAYA: <a target="_blank"> ki jagah button + onClick se
                      state set karte hain — Modal mein khulega, naya
                      raw-image tab kabhi nahi khulega */}
                  {t.attachmentUrl && (
                    <div className="mt-3">
                      <button onClick={() => setPreviewImage(t.attachmentUrl!)} className="block">
                        <img src={t.attachmentUrl} alt="Attachment" className="h-24 w-24 rounded-lg object-cover transition-opacity hover:opacity-80" />
                      </button>
                    </div>
                  )}
                  {t.attachmentName && !t.attachmentUrl && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-600 dark:text-porcelain-300/50">
                      <Paperclip className="h-3 w-3" /> {t.attachmentName}
                    </p>
                  )}
                </div>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value as TicketStatus)}
                  className="h-9 shrink-0 rounded-lg border border-porcelain-300 bg-white px-3 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NAYA: Image Lightbox Modal — proper "X" close-button ke saath,
          browser ke native image-viewer se bilkul alag/better experience */}
      <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} title="Attachment" size="md">
        {previewImage && (
          <div className="flex justify-center">
            <img src={previewImage} alt="Attachment preview" className="max-h-[70vh] w-auto rounded-xl object-contain" />
          </div>
        )}
      </Modal>
    </div>
  )
}