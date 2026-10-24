import { FilterSection } from './FilterSection'
import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'
import { PriceRangeSlider } from '@/components/shared/PriceRangeSlider'
import { categories } from '@/mocks/categories'
import { brands } from '@/mocks/brands'
import type { FilterFacets } from '@/lib/filterProducts'
import type { ProductFilters } from '@/types'
import { cn } from '@/lib/utils'

export interface FiltersPanelProps {
  filters: ProductFilters
  facets: FilterFacets
  onChange: (next: ProductFilters) => void
  lockedCategoryId?: string
  lockedBrandId?: string
}

const ratingOptions = [4, 3, 2, 1]
const discountOptions = [10, 20, 30, 40]

export function FiltersPanel({ filters, facets, onChange, lockedCategoryId, lockedBrandId }: FiltersPanelProps) {
  function toggleInList(key: 'categoryIds' | 'brandIds' | 'colors' | 'sizes' | 'materials', value: string) {
    const current = filters[key] ?? []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  return (
    <div>
      {!lockedCategoryId && (
        <FilterSection title="Category">
          <div className="space-y-2.5">
            {categories.map((c) => (
              <Checkbox
                key={c.id}
                label={c.name}
                checked={filters.categoryIds?.includes(c.id) ?? false}
                onChange={() => toggleInList('categoryIds', c.id)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {!lockedBrandId && (
        <FilterSection title="Brand">
          <div className="space-y-2.5">
            {brands.map((b) => (
              <Checkbox
                key={b.id}
                label={b.name}
                checked={filters.brandIds?.includes(b.id) ?? false}
                onChange={() => toggleInList('brandIds', b.id)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Price">
        <PriceRangeSlider
          min={0}
          max={facets.maxPrice}
          value={filters.priceRange ?? [0, facets.maxPrice]}
          onChange={(range) => onChange({ ...filters, priceRange: range })}
        />
      </FilterSection>

      <FilterSection title="Rating">
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: filters.minRating === r ? undefined : r })}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                filters.minRating === r
                  ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                  : 'border-porcelain-300 text-ink-700 hover:bg-porcelain-100 dark:border-ink-700 dark:text-porcelain-200 dark:hover:bg-ink-800',
              )}
            >
              {r}★ & up
            </button>
          ))}
        </div>
      </FilterSection>

      {facets.colors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2.5">
            {facets.colors.map((c) => {
              const selected = filters.colors?.includes(c.name) ?? false
              return (
                <button
                  key={c.name}
                  onClick={() => toggleInList('colors', c.name)}
                  aria-label={c.name}
                  aria-pressed={selected}
                  title={c.name}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform',
                    selected ? 'border-cobalt-500 scale-110' : 'border-porcelain-300 dark:border-ink-700',
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              )
            })}
          </div>
        </FilterSection>
      )}

      {facets.sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const selected = filters.sizes?.includes(s) ?? false
              return (
                <button
                  key={s}
                  onClick={() => toggleInList('sizes', s)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    selected
                      ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                      : 'border-porcelain-300 text-ink-700 hover:bg-porcelain-100 dark:border-ink-700 dark:text-porcelain-200 dark:hover:bg-ink-800',
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Discount">
        <div className="flex flex-wrap gap-2">
          {discountOptions.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...filters, minDiscount: filters.minDiscount === d ? undefined : d })}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                filters.minDiscount === d
                  ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                  : 'border-porcelain-300 text-ink-700 hover:bg-porcelain-100 dark:border-ink-700 dark:text-porcelain-200 dark:hover:bg-ink-800',
              )}
            >
              {d}% or more
            </button>
          ))}
        </div>
      </FilterSection>

      {facets.materials.length > 0 && (
        <FilterSection title="Material">
          <div className="space-y-2.5">
            {facets.materials.map((m) => (
              <Checkbox key={m} label={m} checked={filters.materials?.includes(m) ?? false} onChange={() => toggleInList('materials', m)} />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Availability" defaultOpen={false}>
        <Switch
          label="In stock only"
          checked={filters.inStockOnly ?? false}
          onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
        />
      </FilterSection>
    </div>
  )
}