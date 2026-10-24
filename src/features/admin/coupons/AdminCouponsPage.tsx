import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Switch } from '@/components/ui/Switch'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal'
import { useToast } from '@/components/ui/Toast'
import { useAdminCouponsStore, type AdminCoupon } from '@/store/useAdminCouponsStore'
import { formatDate } from '@/lib/utils'

const emptyForm = { code: '', description: '', discountType: 'flat' as 'flat' | 'percent', discountValue: '', minOrderValue: '', expiresAt: '' }

export default function AdminCouponsPage() {
  const coupons = useAdminCouponsStore((s) => s.coupons)
  const fetchCoupons = useAdminCouponsStore((s) => s.fetchCoupons)
  const addCoupon = useAdminCouponsStore((s) => s.addCoupon)
  const updateCoupon = useAdminCouponsStore((s) => s.updateCoupon)
  const deleteCoupon = useAdminCouponsStore((s) => s.deleteCoupon)
  const toggleActive = useAdminCouponsStore((s) => s.toggleActive)
  const { toast } = useToast()

  useEffect(() => {
    fetchCoupons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setEditingCode(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(c: AdminCoupon) {
    setEditingCode(c.code)
    setForm({ code: c.code, description: c.description, discountType: c.discountType, discountValue: String(c.discountValue), minOrderValue: c.minOrderValue ? String(c.minOrderValue) : '', expiresAt: c.expiresAt })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.code.trim() || !form.discountValue) return
    const payload: AdminCoupon = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
      expiresAt: form.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      isActive: true,
    }

    setSaving(true)
    try {
      if (editingCode) {
        await updateCoupon(editingCode, payload)
        toast({ type: 'success', title: 'Coupon updated' })
      } else {
        await addCoupon(payload)
        toast({ type: 'success', title: 'Coupon created' })
      }
      setModalOpen(false)
    } catch (err: any) {
      toast({ type: 'error', title: 'Save failed', description: err.response?.data?.message ?? 'Something went wrong.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteCoupon(deleteTarget)
      toast({ type: 'success', title: 'Coupon deleted' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete failed', description: err.response?.data?.message })
    }
    setDeleteTarget(null)
  }

  async function handleToggle(code: string) {
    try {
      await toggleActive(code)
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Coupons</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{coupons.length} coupons</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Coupon</Button>
      </div>

      {coupons.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState icon={<Ticket className="h-7 w-7" />} title="No coupons yet" action={<Button onClick={openAdd}>Add Coupon</Button>} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div key={c.code} className="surface-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="price text-base font-semibold text-ink-950 dark:text-porcelain-100">{c.code}</p>
                  <p className="mt-1 text-xs text-ink-600 dark:text-porcelain-300/70">{c.description}</p>
                </div>
                <Badge variant={c.isActive ? 'success' : 'neutral'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="price mt-3 text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
                {c.discountType === 'percent' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                {c.minOrderValue ? ` · min ₹${c.minOrderValue}` : ''}
              </p>
              <p className="mt-1 text-xs text-ink-600 dark:text-porcelain-300/50">Expires {formatDate(c.expiresAt)}</p>

              <div className="mt-4 flex items-center justify-between border-t border-porcelain-300 pt-3 dark:border-ink-700">
                <Switch checked={c.isActive} onChange={() => handleToggle(c.code)} />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} aria-label="Edit" className="rounded-lg p-1.5 text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(c.code)} aria-label="Delete" className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingCode ? 'Edit Coupon' : 'Add Coupon'} size="md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">Discount Type</label>
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value as 'flat' | 'percent' })}
              className="h-11 w-full rounded-xl border border-porcelain-300 bg-white px-4 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
            >
              <option value="flat">Flat (₹)</option>
              <option value="percent">Percentage (%)</option>
            </select>
          </div>
          <Input label="Discount Value" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          <Input label="Min Order Value (optional)" type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
          <Input label="Expires On" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editingCode ? 'Save Changes' : 'Create Coupon'}</Button>
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this coupon?"
        onConfirm={handleDelete}
      />
    </div>
  )
}