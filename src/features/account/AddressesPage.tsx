import { useEffect, useState } from 'react'
import { Home, Building2, Plus, Trash2, Star, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useAddressesStore } from '@/store/useAddressesStore'
import type { Address } from '@/types'

const emptyForm = { label: 'Home', fullName: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' }

export default function AddressesPage() {
  const addresses = useAddressesStore((s) => s.addresses)
  const fetchAddresses = useAddressesStore((s) => s.fetchAddresses)
  const addAddress = useAddressesStore((s) => s.addAddress)
  const updateAddress = useAddressesStore((s) => s.updateAddress)
  const removeAddress = useAddressesStore((s) => s.removeAddress)
  const setDefault = useAddressesStore((s) => s.setDefault)
  const { toast } = useToast()

  useEffect(() => {
    fetchAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({})
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(addr: Address) {
    setEditingId(addr.id)
    setForm({ label: addr.label, fullName: addr.fullName, line1: addr.line1, line2: addr.line2 ?? '', city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone })
    setErrors({})
    setModalOpen(true)
  }

  async function handleSave() {
    const nextErrors: Partial<typeof emptyForm> = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Required'
    if (!form.line1.trim()) nextErrors.line1 = 'Required'
    if (!form.city.trim()) nextErrors.city = 'Required'
    if (!form.state.trim()) nextErrors.state = 'Required'
    if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = 'Enter a valid 6-digit pincode'
    if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) nextErrors.phone = 'Enter a valid phone number'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      if (editingId) {
        await updateAddress(editingId, form)
        toast({ type: 'success', title: 'Address updated' })
      } else {
        await addAddress(form)
        toast({ type: 'success', title: 'Address added' })
      }
      setModalOpen(false)
    } catch (err: any) {
      toast({ type: 'error', title: 'Save failed', description: err.response?.data?.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeAddress(id)
      toast({ type: 'success', title: 'Address deleted' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete failed', description: err.response?.data?.message })
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefault(id)
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Addresses</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Manage your delivery addresses.</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState title="No addresses yet" description="Add an address to speed up checkout." action={<Button onClick={openAdd}>Add Address</Button>} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => {
            const Icon = addr.label === 'Home' ? Home : Building2
            return (
              <div key={addr.id} className="surface-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-950 dark:text-porcelain-100">
                    <Icon className="h-4 w-4" /> {addr.label}
                    {addr.isDefault && <Badge variant="cobalt">Default</Badge>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(addr)} aria-label="Edit address" className="rounded-lg p-1.5 text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} aria-label="Delete address" className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-600 dark:text-porcelain-300/70">
                  {addr.fullName}<br />
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} {addr.pincode}<br />
                  {addr.phone}
                </p>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cobalt-600 dark:text-cobalt-400">
                    <Star className="h-3.5 w-3.5" /> Set as default
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Address' : 'Add Address'} size="md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">Label</label>
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map((l) => (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, label: l })}
                  className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors ${form.label === l ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400' : 'border-porcelain-300 text-ink-700 dark:border-ink-700 dark:text-porcelain-200'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
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
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editingId ? 'Save Changes' : 'Add Address'}</Button>
        </div>
      </Modal>
    </div>
  )
}