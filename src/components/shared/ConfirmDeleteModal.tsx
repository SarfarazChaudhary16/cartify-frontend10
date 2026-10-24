import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = 'Delete this item?',
  description = 'This action cannot be undone.',
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}) {
  const [deleting, setDeleting] = useState(false)

  function handleConfirm() {
    setDeleting(true)
    window.setTimeout(() => {
      onConfirm()
      setDeleting(false)
    }, 500)
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-500/10 text-danger-500">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-medium text-ink-950 dark:text-porcelain-100">{title}</p>
        <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{description}</p>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} loading={deleting}>Delete</Button>
      </div>
    </Modal>
  )
}