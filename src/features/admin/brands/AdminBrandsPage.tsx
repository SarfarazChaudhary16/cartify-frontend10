import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal'
import { useToast } from '@/components/ui/Toast'
import { useAdminBrandsStore } from '@/store/useAdminBrandsStore'
import type { Brand } from '@/types'

const emptyForm = { name: '', slug: '', logo: '', description: '' }

export default function AdminBrandsPage() {
  const brands = useAdminBrandsStore((s) => s.brands)
  const fetchBrands = useAdminBrandsStore((s) => s.fetchBrands)
  const addBrand = useAdminBrandsStore((s) => s.addBrand)
  const updateBrand = useAdminBrandsStore((s) => s.updateBrand)
  const deleteBrand = useAdminBrandsStore((s) => s.deleteBrand)
  const { toast } = useToast()

  useEffect(() => {
    if (brands.length === 0) fetchBrands()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(brand: Brand) {
    setEditing(brand)
    setForm({ name: brand.name, slug: brand.slug, logo: brand.logo, description: brand.description ?? '' })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-')
    const logo = form.logo.trim() || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(form.name)}`

    setSaving(true)
    try {
      if (editing) {
        await updateBrand(editing.id, { name: form.name, slug, logo, description: form.description })
        toast({ type: 'success', title: 'Brand updated' })
      } else {
        await addBrand({ name: form.name, slug, logo, description: form.description })
        toast({ type: 'success', title: 'Brand added' })
      }
      setModalOpen(false)
    } catch (err: any) {
      toast({ type: 'error', title: 'Save failed', description: err.response?.data?.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Brands</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{brands.length} brands</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Brand</Button>
      </div>

      {brands.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState title="No brands yet" action={<Button onClick={openAdd}>Add Brand</Button>} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.id} className="surface-card flex items-start gap-3 p-4">
              <img src={brand.logo} alt={brand.name} className="h-12 w-12 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-950 dark:text-porcelain-100">{brand.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-600 dark:text-porcelain-300/60">{brand.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => openEdit(brand)} aria-label="Edit" className="rounded-lg p-1.5 text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(brand.id)} aria-label="Delete" className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Brand' : 'Add Brand'} size="sm">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="Logo URL (optional)" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Save Changes' : 'Add Brand'}</Button>
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this brand?"
        onConfirm={async () => {
          if (deleteTarget) {
            try {
              await deleteBrand(deleteTarget)
              toast({ type: 'success', title: 'Brand deleted' })
            } catch (err: any) {
              toast({ type: 'error', title: 'Delete failed', description: err.response?.data?.message })
            }
          }
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}