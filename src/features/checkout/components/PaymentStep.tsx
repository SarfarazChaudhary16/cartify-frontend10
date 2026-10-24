import { useState } from 'react'
import { Smartphone, CreditCard, Wallet, Banknote, Landmark, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export type PaymentMethodId = 'upi' | 'card' | 'wallet' | 'cod' | 'netbanking'

const methods: { id: PaymentMethodId; label: string; icon: typeof Smartphone }[] = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
]

const wallets = ['Paytm', 'PhonePe', 'Amazon Pay']
const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra']

export interface PaymentStepProps {
  selected: PaymentMethodId
  onSelect: (id: PaymentMethodId) => void
  onNext: () => void
  onBack: () => void
}

export function PaymentStep({ selected, onSelect, onNext, onBack }: PaymentStepProps) {
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [wallet, setWallet] = useState(wallets[0])
  const [bank, setBank] = useState(banks[0])
  const [error, setError] = useState('')

  function handleContinue() {
    if (selected === 'upi' && !/^[\w.-]+@[\w]+$/.test(upiId)) {
      setError('Enter a valid UPI ID (e.g. yourname@bank).')
      return
    }
    if (selected === 'card' && (card.number.replace(/\s/g, '').length < 16 || card.cvv.length < 3 || !card.name || !card.expiry)) {
      setError('Fill in all card details correctly.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink-950 dark:text-porcelain-100">Payment Method</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {methods.map((m) => {
          const active = selected === m.id
          return (
            <button
              key={m.id}
              onClick={() => {
                onSelect(m.id)
                setError('')
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-colors',
                active ? 'border-cobalt-500 bg-cobalt-500/5' : 'border-porcelain-300 dark:border-ink-700',
              )}
            >
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', active ? 'bg-cobalt-500 text-white' : 'bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/60')}>
                <m.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-ink-950 dark:text-porcelain-100">{m.label}</span>
            </button>
          )
        })}
      </div>

      <div className="surface-card mt-5 p-5">
        {selected === 'upi' && (
          <Input label="UPI ID" placeholder="yourname@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} error={error || undefined} />
        )}

        {selected === 'card' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Input label="Name on Card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            </div>
            <Input label="Expiry (MM/YY)" placeholder="08/29" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
            <Input label="CVV" type="password" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
            {error && <p className="sm:col-span-2 text-xs font-medium text-danger-500">{error}</p>}
          </div>
        )}

        {selected === 'wallet' && (
          <div>
            <p className="mb-2.5 text-sm font-medium text-ink-950 dark:text-porcelain-100">Choose a wallet</p>
            <div className="flex flex-wrap gap-2.5">
              {wallets.map((w) => (
                <button
                  key={w}
                  onClick={() => setWallet(w)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                    wallet === w ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400' : 'border-porcelain-300 text-ink-700 dark:border-ink-700 dark:text-porcelain-200',
                  )}
                >
                  {wallet === w && <Check className="h-3.5 w-3.5" />} {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {selected === 'netbanking' && (
          <div>
            <p className="mb-2.5 text-sm font-medium text-ink-950 dark:text-porcelain-100">Select your bank</p>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="h-11 w-full rounded-xl border border-porcelain-300 bg-white px-4 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
            >
              {banks.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {selected === 'cod' && (
          <p className="text-sm text-ink-600 dark:text-porcelain-300/70">
            Pay with cash when your order is delivered. Available for orders under ₹50,000. A small COD handling fee may apply.
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button size="lg" onClick={handleContinue}>Review Order</Button>
      </div>
    </div>
  )
}