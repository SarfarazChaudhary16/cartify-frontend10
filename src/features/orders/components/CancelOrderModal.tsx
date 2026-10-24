import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useOrdersStore } from '@/store/useOrdersStore'
import { cn } from '@/lib/utils'

const reasons = ['Changed my mind', 'Found a better price elsewhere', 'Ordered by mistake', 'Delivery is taking too long', 'Other']

export function CancelOrderModal({ open, onClose, orderId }: { open: boolean; onClose: () => void; orderId: string }) {
  const cancelOrder = useOrdersStore((s) => s.cancelOrder)
  const { toast } = useToast()
  const [reason, setReason] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleConfirm() {
    if (!reason) return
    setSubmitting(true)
    window.setTimeout(() => {
      cancelOrder(orderId, reason)
      setSubmitting(false)
      toast({ type: 'success', title: 'Order cancelled', description: 'Your cancellation has been confirmed.' })
      setReason(null)
      onClose()
    }, 600)
  }

  return (
    <Modal open={open} onClose={onClose} title="Cancel this order?" size="sm">
      <p className="text-sm text-ink-600 dark:text-porcelain-300/70">Let us know why — this helps us improve.</p>
      <div className="mt-4 space-y-2">
        {reasons.map((r) => (
          <button
            key={r}
            onClick={() => setReason(r)}
            className={cn(
              'w-full rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
              reason === r
                ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                : 'border-porcelain-300 text-ink-700 dark:border-ink-700 dark:text-porcelain-200',
            )}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Keep Order</Button>
        <Button variant="danger" onClick={handleConfirm} disabled={!reason} loading={submitting}>
          Confirm Cancellation
        </Button>
      </div>
    </Modal>
  )
}