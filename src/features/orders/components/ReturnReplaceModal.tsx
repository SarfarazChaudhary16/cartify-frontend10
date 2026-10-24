import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useOrdersStore } from '@/store/useOrdersStore'
import { cn } from '@/lib/utils'

type RequestType = 'return' | 'replace'

export function ReturnReplaceModal({ open, onClose, orderId }: { open: boolean; onClose: () => void; orderId: string }) {
  const requestReturnOrReplace = useOrdersStore((s) => s.requestReturnOrReplace)
  const { toast } = useToast()
  const [type, setType] = useState<RequestType>('return')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit() {
    if (reason.trim().length < 10) {
      setError('Please describe the issue (at least 10 characters).')
      return
    }
    setError('')
    setSubmitting(true)
    window.setTimeout(() => {
      requestReturnOrReplace(orderId, type, reason.trim())
      setSubmitting(false)
      toast({
        type: 'success',
        title: type === 'return' ? 'Return requested' : 'Replacement requested',
        description: 'We\u2019ll pick up the item within 2-3 business days.',
      })
      setReason('')
      onClose()
    }, 700)
  }

  return (
    <Modal open={open} onClose={onClose} title="Return or Replace" size="sm">
      <div className="flex gap-2">
        {(['return', 'replace'] as RequestType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              'flex-1 rounded-lg border px-3.5 py-2 text-sm font-medium capitalize transition-colors',
              type === t
                ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                : 'border-porcelain-300 text-ink-700 dark:border-ink-700 dark:text-porcelain-200',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Textarea
          label="What's the issue?"
          placeholder="e.g. Wrong size delivered, item arrived damaged…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={error}
          rows={4}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} loading={submitting}>
          Submit Request
        </Button>
      </div>
    </Modal>
  )
}