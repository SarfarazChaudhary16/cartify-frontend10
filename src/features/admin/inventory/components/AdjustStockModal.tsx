import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

type AdjustType = 'add' | 'remove'

export function AdjustStockModal({
  product,
  onClose,
  onConfirm,
}: {
  product: Product | null
  onClose: () => void
  onConfirm: (delta: number, reason: string) => void
}) {
  const [type, setType] = useState<AdjustType>('add')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  function handleClose() {
    setType('add')
    setQuantity('')
    setReason('')
    setError('')
    onClose()
  }

  function handleConfirm() {
    const qty = Number(quantity)
    if (!qty || qty <= 0) {
      setError('Enter a quantity greater than 0.')
      return
    }
    if (!reason.trim()) {
      setError('Add a reason for this adjustment.')
      return
    }
    onConfirm(type === 'add' ? qty : -qty, reason.trim())
    handleClose()
  }

  return (
    <Modal open={!!product} onClose={handleClose} title={product ? `Adjust Stock — ${product.title}` : ''} size="sm">
      {product && (
        <div className="space-y-4">
          <p className="text-sm text-ink-600 dark:text-porcelain-300/70">
            Current stock: <span className="price font-semibold text-ink-950 dark:text-porcelain-100">{product.stock}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setType('add')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                type === 'add' ? 'border-success-500 bg-success-500/10 text-success-500' : 'border-porcelain-300 text-ink-700 dark:border-ink-700 dark:text-porcelain-200',
              )}
            >
              <Plus className="h-4 w-4" /> Add Stock
            </button>
            <button
              onClick={() => setType('remove')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                type === 'remove' ? 'border-danger-500 bg-danger-500/10 text-danger-500' : 'border-porcelain-300 text-ink-700 dark:border-ink-700 dark:text-porcelain-200',
              )}
            >
              <Minus className="h-4 w-4" /> Remove Stock
            </button>
          </div>

          <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input label="Reason" placeholder="e.g. New shipment received, damaged units…" value={reason} onChange={(e) => setReason(e.target.value)} />
          {error && <p className="text-xs font-medium text-danger-500">{error}</p>}
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm Adjustment</Button>
      </div>
    </Modal>
  )
}