import { useState } from 'react'
import { CreditCard, Plus, Trash2, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { usePaymentMethodsStore, type SavedCard } from '@/store/usePaymentMethodsStore'

function detectBrand(number: string): SavedCard['brand'] {
  if (number.startsWith('4')) return 'Visa'
  if (number.startsWith('5')) return 'Mastercard'
  if (number.startsWith('3')) return 'Amex'
  return 'RuPay'
}

export default function PaymentMethodsPage() {
  const cards = usePaymentMethodsStore((s) => s.cards)
  const addCard = usePaymentMethodsStore((s) => s.addCard)
  const removeCard = usePaymentMethodsStore((s) => s.removeCard)
  const setDefault = usePaymentMethodsStore((s) => s.setDefault)
  const { toast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ number: '', expiry: '', cvv: '' })
  const [error, setError] = useState('')

  function handleAdd() {
    const digits = form.number.replace(/\s/g, '')
    if (digits.length < 16 || !/^\d{2}\/\d{2}$/.test(form.expiry) || form.cvv.length < 3) {
      setError('Fill in all card details correctly.')
      return
    }
    addCard({ brand: detectBrand(digits), last4: digits.slice(-4), expiry: form.expiry })
    toast({ type: 'success', title: 'Card added' })
    setForm({ number: '', expiry: '', cvv: '' })
    setError('')
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Payment Methods</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Saved cards for faster checkout.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>Add Card</Button>
      </div>

      {cards.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState icon={<CreditCard className="h-7 w-7" />} title="No saved cards" description="Add a card to speed up checkout." action={<Button onClick={() => setModalOpen(true)}>Add Card</Button>} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <div key={card.id} className="surface-card relative overflow-hidden p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-ink-900 to-ink-950 opacity-[0.03] dark:opacity-10" />
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/70">
                  <CreditCard className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2">
                  {card.isDefault && <Badge variant="cobalt">Default</Badge>}
                  <button onClick={() => removeCard(card.id)} aria-label="Remove card" className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="price mt-4 text-lg font-semibold tracking-wider text-ink-950 dark:text-porcelain-100">•••• •••• •••• {card.last4}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-ink-600 dark:text-porcelain-300/60">{card.brand} · Expires {card.expiry}</p>
                {!card.isDefault && (
                  <button onClick={() => setDefault(card.id)} className="flex items-center gap-1.5 text-xs font-medium text-cobalt-600 dark:text-cobalt-400">
                    <Star className="h-3.5 w-3.5" /> Set default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Card" size="sm">
        <div className="space-y-4">
          <Input label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19} value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry (MM/YY)" placeholder="08/29" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            <Input label="CVV" type="password" maxLength={4} value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} />
          </div>
          {error && <p className="text-xs font-medium text-danger-500">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Card</Button>
        </div>
      </Modal>
    </div>
  )
}