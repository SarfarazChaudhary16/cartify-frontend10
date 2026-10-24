import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories } from '@/mocks/categories'
import { brands } from '@/mocks/brands'
import { formatPrice } from '@/lib/utils'
import type { ProductFilters } from '@/types'

export interface Chip {
  key: string
  label: string
  onRemove: () => void
}

function buildChips(filters: ProductFilters, onChange: (next: ProductFilters) => void, maxPrice: number): Chip[] {
  const chips: Chip[] = []

  filters.categoryIds?.forEach((id) => {
    const cat = categories.find((c) => c.id === id)
    if (cat) chips.push({ key: `cat-${id}`, label: cat.name, onRemove: () => onChange({ ...filters, categoryIds: filters.categoryIds?.filter((c) => c !== id) }) })
  })
  filters.brandIds?.forEach((id) => {
    const brand = brands.find((b) => b.id === id)
    if (brand) chips.push({ key: `brand-${id}`, label: brand.name, onRemove: () => onChange({ ...filters, brandIds: filters.brandIds?.filter((b) => b !== id) }) })
  })
  filters.colors?.forEach((c) => chips.push({ key: `color-${c}`, label: c, onRemove: () => onChange({ ...filters, colors: filters.colors?.filter((x) => x !== c) }) }))
  filters.sizes?.forEach((s) => chips.push({ key: `size-${s}`, label: `Size ${s}`, onRemove: () => onChange({ ...filters, sizes: filters.sizes?.filter((x) => x !== s) }) }))
  filters.materials?.forEach((m) => chips.push({ key: `mat-${m}`, label: m, onRemove: () => onChange({ ...filters, materials: filters.materials?.filter((x) => x !== m) }) }))
  if (filters.minRating) chips.push({ key: 'rating', label: `${filters.minRating}★ & up`, onRemove: () => onChange({ ...filters, minRating: undefined }) })
  if (filters.minDiscount) chips.push({ key: 'discount', label: `${filters.minDiscount}% off & up`, onRemove: () => onChange({ ...filters, minDiscount: undefined }) })
  if (filters.inStockOnly) chips.push({ key: 'stock', label: 'In stock only', onRemove: () => onChange({ ...filters, inStockOnly: undefined }) })
  if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice)) {
    chips.push({
      key: 'price',
      label: `${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`,
      onRemove: () => onChange({ ...filters, priceRange: undefined }),
    })
  }

  return chips
}

export function ActiveFilterChips({
  filters,
  onChange,
  maxPrice,
  onClearAll,
}: {
  filters: ProductFilters
  onChange: (next: ProductFilters) => void
  maxPrice: number
  onClearAll: () => void
}) {
  const chips = buildChips(filters, onChange, maxPrice)
  if (chips.length === 0) return null

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={chip.onRemove}
            className="flex items-center gap-1.5 rounded-full bg-cobalt-500/10 px-3 py-1.5 text-xs font-medium text-cobalt-600 dark:text-cobalt-400"
          >
            {chip.label}
            <X className="h-3 w-3" />
          </motion.button>
        ))}
      </AnimatePresence>
      <button onClick={onClearAll} className="text-xs font-medium text-ink-600 underline underline-offset-2 dark:text-porcelain-300/60">
        Clear all
      </button>
    </div>
  )
}