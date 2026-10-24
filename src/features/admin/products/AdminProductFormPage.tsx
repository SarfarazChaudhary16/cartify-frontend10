import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { ImagesManager } from './components/ImagesManager'
import { ColorsEditor, SizesEditor, SpecificationsEditor, VariantsTableEditor } from './components/VariantsEditor'
import { useAdminProductsStore } from '@/store/useAdminProductsStore'
import { useAdminCategoriesStore } from '@/store/useAdminCategoriesStore'
import { useAdminBrandsStore } from '@/store/useAdminBrandsStore'
import type { Product } from '@/types'

const emptyProduct = (): Omit<Product, 'id' | 'createdAt'> => ({
  slug: '',
  title: '',
  brandId: '',
  categoryId: '',
  description: '',
  images: [],
  price: 0,
  currency: 'INR',
  rating: 0,
  reviewCount: 0,
  stock: 0,
  tags: [],
  colors: [],
  sizes: [],
  variants: [],
  specifications: [],
})

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminProductFormPage() {
  const { productId } = useParams()
  const isEdit = !!productId
  const navigate = useNavigate()
  const { toast } = useToast()

  const products = useAdminProductsStore((s) => s.products)
  const fetchProducts = useAdminProductsStore((s) => s.fetchProducts)
  const getProduct = useAdminProductsStore((s) => s.getProduct)
  const addProduct = useAdminProductsStore((s) => s.addProduct)
  const updateProduct = useAdminProductsStore((s) => s.updateProduct)
  const categories = useAdminCategoriesStore((s) => s.categories)
  const fetchCategories = useAdminCategoriesStore((s) => s.fetchCategories)
  const brands = useAdminBrandsStore((s) => s.brands)
  const fetchBrands = useAdminBrandsStore((s) => s.fetchBrands)

  const [dataReady, setDataReady] = useState(false)

  // NAYA: Directly is form-page pe aane par (jaise browser refresh),
  // Products/Categories/Brands abhi tak fetch nahi hue ho sakte —
  // isliye yahan bhi ensure karte hain ki data load ho chuka hai,
  // TABHI form render karte hain (warna dropdowns khaali dikhenge)
  useEffect(() => {
    async function loadData() {
      const tasks: Promise<void>[] = []
      if (products.length === 0) tasks.push(fetchProducts())
      if (categories.length === 0) tasks.push(fetchCategories())
      if (brands.length === 0) tasks.push(fetchBrands())
      await Promise.all(tasks)
      setDataReady(true)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const existing = isEdit && productId ? getProduct(productId) : undefined

  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt'>>(emptyProduct())
  const [errors, setErrors] = useState<{ title?: string; price?: string; images?: string }>({})
  const [saving, setSaving] = useState(false)

  // Jab data ready ho jaye (categories/brands/products load ho chuke hon),
  // form ko sahi initial values se bharte hain — Edit mode mein existing
  // product ke fields, Add mode mein pehla brand/category default select
  useEffect(() => {
    if (!dataReady) return
    if (isEdit && existing) {
      setForm({ ...existing })
    } else if (!isEdit) {
      setForm({ ...emptyProduct(), brandId: brands[0]?.id ?? '', categoryId: categories[0]?.id ?? '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady, existing])

  if (!dataReady) {
    return <div className="py-10 text-center text-sm text-ink-600 dark:text-porcelain-300/60">Loading…</div>
  }

  if (isEdit && !existing) {
    return (
      <div className="py-10">
        <EmptyState title="Product not found" description="This product may have been deleted." action={<Link to="/admin/products"><Button variant="outline">Back to Products</Button></Link>} />
      </div>
    )
  }

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    const nextErrors: typeof errors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (form.price <= 0) nextErrors.price = 'Enter a valid price.'
    if (form.images.length === 0) nextErrors.images = 'Add at least one image.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.title) }

    try {
      if (isEdit && existing) {
        await updateProduct(existing.id, payload)
        toast({ type: 'success', title: 'Product updated' })
      } else {
        await addProduct(payload)
        toast({ type: 'success', title: 'Product created' })
      }
      navigate('/admin/products')
    } catch (err: any) {
      toast({ type: 'error', title: 'Save failed', description: err.response?.data?.message ?? 'Something went wrong.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/products" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-porcelain-300/70">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <div className="surface-card mt-6 space-y-6 p-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} error={errors.title} />
            </div>
            <Input label="Slug (auto-generated if left blank)" value={form.slug} onChange={(e) => update('slug', e.target.value)} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">Brand</label>
              <select
                value={form.brandId}
                onChange={(e) => update('brandId', e.target.value)}
                className="h-11 w-full rounded-xl border border-porcelain-300 bg-white px-4 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
              >
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-950 dark:text-porcelain-100">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => update('categoryId', e.target.value)}
                className="h-11 w-full rounded-xl border border-porcelain-300 bg-white px-4 text-sm text-ink-950 outline-none focus:border-cobalt-500 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
              >
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Textarea label="Description" rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Pricing & Inventory</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Input label="Price (₹)" type="number" value={form.price || ''} onChange={(e) => update('price', Number(e.target.value))} error={errors.price} />
            <Input label="Compare-at Price" type="number" value={form.compareAtPrice ?? ''} onChange={(e) => update('compareAtPrice', Number(e.target.value) || undefined)} />
            <Input label="Stock" type="number" value={form.stock || ''} onChange={(e) => update('stock', Number(e.target.value))} />
            <Input label="Material" value={form.material ?? ''} onChange={(e) => update('material', e.target.value)} />
          </div>
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          <h2 className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Merchandising Flags</h2>
          <div className="flex flex-wrap gap-6">
            <Switch label="New Arrival" checked={!!form.isNew} onChange={(e) => update('isNew', e.target.checked)} />
            <Switch label="Best Seller" checked={!!form.isBestSeller} onChange={(e) => update('isBestSeller', e.target.checked)} />
            <Switch label="Flash Sale" checked={!!form.isFlashSale} onChange={(e) => update('isFlashSale', e.target.checked)} />
          </div>
          {form.isFlashSale && (
            <div className="mt-4 max-w-xs">
              <Input label="Discount %" type="number" value={form.discountPercent ?? ''} onChange={(e) => update('discountPercent', Number(e.target.value))} />
            </div>
          )}
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          {errors.images && <p className="mb-2 text-xs font-medium text-danger-500">{errors.images}</p>}
          <ImagesManager images={form.images} onChange={(images) => update('images', images)} />
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          <ColorsEditor colors={form.colors ?? []} onChange={(colors) => update('colors', colors)} />
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          <SizesEditor sizes={form.sizes ?? []} onChange={(sizes) => update('sizes', sizes)} />
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          <VariantsTableEditor variants={form.variants ?? []} colors={form.colors ?? []} sizes={form.sizes ?? []} onChange={(variants) => update('variants', variants)} />
        </div>

        <div className="border-t border-porcelain-300 pt-6 dark:border-ink-700">
          <SpecificationsEditor specs={form.specifications} onChange={(specs) => update('specifications', specs)} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link to="/admin/products">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button onClick={handleSave} loading={saving}>
          {isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </div>
  )
}