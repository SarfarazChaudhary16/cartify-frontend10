import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal'
import { useToast } from '@/components/ui/Toast'
import { useAdminCategoriesStore } from '@/store/useAdminCategoriesStore'
import type { Category } from '@/types'

const emptyForm = { name: '', slug: '', image: '' }

export default function AdminCategoriesPage() {
  const categories = useAdminCategoriesStore((s) => s.categories)
  const fetchCategories = useAdminCategoriesStore((s) => s.fetchCategories)
  const addCategory = useAdminCategoriesStore((s) => s.addCategory)
  const updateCategory = useAdminCategoriesStore((s) => s.updateCategory)
  const deleteCategory = useAdminCategoriesStore((s) => s.deleteCategory)
  const { toast } = useToast()

  useEffect(() => {
    if (categories.length === 0) fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, image: cat.image })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.image.trim()) return
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-')

    setSaving(true)
    try {
      if (editing) {
        await updateCategory(editing.id, { name: form.name, slug, image: form.image })
        toast({ type: 'success', title: 'Category updated' })
      } else {
        await addCategory({ name: form.name, slug, image: form.image })
        toast({ type: 'success', title: 'Category added' })
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
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Categories</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{categories.length} categories</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState title="No categories yet" action={<Button onClick={openAdd}>Add Category</Button>} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="surface-card overflow-hidden">
              <img src={cat.image} alt={cat.name} className="h-32 w-full object-cover" />
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-950 dark:text-porcelain-100">{cat.name}</p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{cat.productCount} products</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} aria-label="Edit" className="rounded-lg p-1.5 text-ink-600 hover:bg-porcelain-100 dark:text-porcelain-300/60 dark:hover:bg-ink-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(cat.id)} aria-label="Delete" className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? 'Save Changes' : 'Add Category'}</Button>
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this category?"
        onConfirm={async () => {
          if (deleteTarget) {
            try {
              await deleteCategory(deleteTarget)
              toast({ type: 'success', title: 'Category deleted' })
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