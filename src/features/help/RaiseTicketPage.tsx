import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Paperclip, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useSupportTicketsStore, type TicketStatus } from '@/store/useSupportTicketsStore'
import { helpFaqCategories } from '@/mocks/helpFaqs'
import { formatDate } from '@/lib/utils'

const statusVariant: Record<TicketStatus, 'warning' | 'cobalt' | 'success'> = {
  open: 'warning',
  in_progress: 'cobalt',
  resolved: 'success',
}

export default function RaiseTicketPage() {
  const navigate = useNavigate()
  const tickets = useSupportTicketsStore((s) => s.tickets)
  const fetchMyTickets = useSupportTicketsStore((s) => s.fetchMyTickets)
  const addTicket = useSupportTicketsStore((s) => s.addTicket)
  const uploadAttachment = useSupportTicketsStore((s) => s.uploadAttachment)
  const { toast } = useToast()

  useEffect(() => {
    fetchMyTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [form, setForm] = useState({ subject: '', category: helpFaqCategories[0].id as string, orderNumber: '', description: '' })
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    const nextErrors: typeof errors = {}
    if (!form.subject.trim()) nextErrors.subject = 'Please add a subject.'
    if (form.description.trim().length < 15) nextErrors.description = 'Please describe your issue (at least 15 characters).'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      // NAYA: Agar user ne image select ki hai, PEHLE use Cloudinary
      // pe upload karte hain (real URL milta hai), TABHI ticket create
      // karte hain — taaki attachmentUrl bhi request ke saath jaye
      let attachmentUrl: string | undefined
      if (attachmentFile) {
        attachmentUrl = await uploadAttachment(attachmentFile)
      }

      const ticket = await addTicket({
        subject: form.subject.trim(),
        category: form.category,
        orderNumber: form.orderNumber.trim() || undefined,
        description: form.description.trim(),
        attachmentName: attachmentFile?.name,
        attachmentUrl,
      })
      setSubmittedTicket(ticket.ticketNumber)
      setForm({ subject: '', category: helpFaqCategories[0].id, orderNumber: '', description: '' })
      setAttachmentFile(null)
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to submit ticket', description: err.response?.data?.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/help" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-porcelain-300/70">
        <ChevronLeft className="h-4 w-4" /> Back to Help Center
      </Link>

      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Raise a Ticket</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Tell us what's wrong and we'll get back to you within 24 hours.</p>

      <AnimatePresence mode="wait">
        {submittedTicket ? (
          <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="surface-card mt-6 p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-500/10 text-success-500">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-xl font-medium text-ink-950 dark:text-porcelain-100">Ticket submitted!</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">
              Your ticket number is <span className="price font-medium text-ink-950 dark:text-porcelain-100">#{submittedTicket}</span>. We'll email you updates.
            </p>
            <Button className="mt-5" onClick={() => setSubmittedTicket(null)}>
              Raise Another Ticket
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card mt-6 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Subject" placeholder="Briefly describe the issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={errors.subject} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-11 w-full rounded-xl border border-porcelain-300 bg-white px-4 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
                >
                  {helpFaqCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <Input label="Order Number (optional)" placeholder="CF-10293" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} />
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  placeholder="Tell us what happened…"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  error={errors.description}
                />
              </div>

              <div className="sm:col-span-2">
                {attachmentFile ? (
                  <div className="flex items-center gap-2 rounded-lg bg-porcelain-100 px-3 py-2 text-sm text-ink-700 dark:bg-ink-800 dark:text-porcelain-200">
                    <Paperclip className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{attachmentFile.name}</span>
                    <button onClick={() => setAttachmentFile(null)} aria-label="Remove attachment">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg border-2 border-dashed border-porcelain-300 px-4 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:border-cobalt-500 hover:text-cobalt-600 dark:border-ink-700 dark:text-porcelain-300/60"
                  >
                    <Paperclip className="h-4 w-4" /> Attach a file (optional)
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <Button className="mt-6 w-full" loading={submitting} onClick={handleSubmit}>
              Submit Ticket
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {tickets.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">My Tickets</h2>
          <div className="space-y-3">
            {tickets.map((t) => (
              // NAYA: Ab har ticket CLICKABLE hai — click karke uski
              // "Ticket Details" page pe jaate hain, jahan poori
              // tracking-timeline dikhti hai (Order-tracking jaisa)
              <button
                key={t.id}
                onClick={() => navigate(`/help/tickets/${t.id}`)}
                className="surface-card surface-card-lift flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{t.subject}</p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">#{t.ticketNumber} · {formatDate(t.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={statusVariant[t.status]} className="capitalize">
                    {t.status.replace('_', ' ')}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-ink-600 dark:text-porcelain-300/50" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}