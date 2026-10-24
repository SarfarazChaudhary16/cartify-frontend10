import { useState } from 'react'
import { Check, Plus, Home, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAddressesStore } from '@/store/useAddressesStore'
import type { Address } from '@/types'
import { cn } from '@/lib/utils'

export interface AddressStepProps {
  selectedId: string | null
  onSelect: (address: Address) => void
  onNext: () => void
}

type FormErrors = Partial<Record<keyof Address, string>>

export function AddressStep({ selectedId, onSelect, onNext }: AddressStepProps) {
  const savedAddresses = useAddressesStore((s) => s.addresses)
  const addAddress = useAddressesStore((s) => s.addAddress)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: 'Home', fullName: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})

  function handleAddAddress() {
    const nextErrors: FormErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Required'
    if (!form.line1.trim()) nextErrors.line1 = 'Required'
    if (!form.city.trim()) nextErrors.city = 'Required'
    if (!form.state.trim()) nextErrors.state = 'Required'
    if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = 'Enter a valid 6-digit pincode'
    if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) nextErrors.phone = 'Enter a valid phone number'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const newAddress = addAddress(form)
    onSelect(newAddress)
    setShowForm(false)
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-ink-950 dark:text-porcelain-100">Delivery Address</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {savedAddresses.map((addr) => {
          const selected = selectedId === addr.id
          const Icon = addr.label === 'Home' ? Home : Building2
          return (
            <button
              key={addr.id}
              onClick={() => onSelect(addr)}
              className={cn(
                'relative rounded-xl border-2 p-4 text-left transition-colors',
                selected ? 'border-cobalt-500 bg-cobalt-500/5' : 'border-porcelain-300 dark:border-ink-700',
              )}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-porcelain-100">
                <Icon className="h-4 w-4" /> {addr.label}
              </div>
              <p className="mt-1.5 text-sm text-ink-600 dark:text-porcelain-300/70">
                {addr.fullName}<br />
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} {addr.pincode}<br />
                {addr.phone}
              </p>
              {selected && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cobalt-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          )
        })}

        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-porcelain-300 text-sm font-medium text-ink-600 transition-colors hover:border-cobalt-500 hover:text-cobalt-600 dark:border-ink-700 dark:text-porcelain-300/60"
        >
          <Plus className="h-5 w-5" /> Add new address
        </button>
      </div>

      {showForm && (
        <div className="surface-card mt-4 grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
          <div className="sm:col-span-2">
            <Input label="Address Line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} error={errors.line1} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Address Line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
          </div>
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} error={errors.city} />
          <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} error={errors.state} />
          <Input label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} error={errors.pincode} />
          <div className="sm:col-span-2">
            <Button onClick={handleAddAddress}>Save Address</Button>
          </div>
        </div>
      )}

      <Button size="lg" className="mt-6" disabled={!selectedId} onClick={onNext}>
        Continue to Shipping
      </Button>
    </div>
  )
}