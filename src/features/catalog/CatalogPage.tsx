import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { FiltersPanel } from './components/FiltersPanel'
import { SortDropdown } from './components/SortDropdown'
import { ActiveFilterChips } from './components/ActiveFilterChips'
import { ProductGrid } from './components/ProductGrid'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { useProductsStore } from '@/store/useProductsStore'
import { useCategoriesStore } from '@/store/useCategoriesStore'
import { useBrandsStore } from '@/store/useBrandsStore'
import { applyFilters, sortProducts, getFilterFacets } from '@/lib/filterProducts'
import type { ProductFilters, SortOption } from '@/types'

const PAGE_SIZE = 8

export default function CatalogPage() {
  const { categorySlug, brandSlug } = useParams()
  const [searchParams] = useSearchParams()
  const quickFilter = searchParams.get('filter') // 'new' | 'flash-sale'

  // ===== Real backend data (replace static mock imports) =====
  const allProducts = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)
  const categories = useCategoriesStore((s) => s.categories)
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories)
  const brands = useBrandsStore((s) => s.brands)
  const fetchBrands = useBrandsStore((s) => s.fetchBrands)

  // Sirf ek baar fetch karte hain jab store khaali ho (jaise pehli baar
  // page load hote waqt) — agar user dobara isi session mein wapas aaye,
  // dobara API call nahi lagti, jo already-fetched data use ho jata hai
  useEffect(() => {
    if (allProducts.length === 0) fetchProducts()
    if (categories.length === 0) fetchCategories()
    if (brands.length === 0) fetchBrands()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) : undefined
  const brand = brandSlug ? brands.find((b) => b.slug === brandSlug) : undefined

  const scoped = useMemo(() => {
    let list = allProducts
    if (category) list = list.filter((p) => p.categoryId === category.id)
    if (brand) list = list.filter((p) => p.brandId === brand.id)
    if (quickFilter === 'new') list = list.filter((p) => p.isNew)
    if (quickFilter === 'flash-sale') list = list.filter((p) => p.isFlashSale)
    return list
  }, [allProducts, category, brand, quickFilter])

  const facets = useMemo(() => getFilterFacets(scoped), [scoped])

  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<SortOption>('relevance')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Reset when the route-level scope changes (category/brand/quick filter)
  useEffect(() => {
    setFilters({})
    setVisibleCount(PAGE_SIZE)
  }, [categorySlug, brandSlug, quickFilter])

  // Simulate network latency so loading skeletons are demonstrated (cosmetic —
  // the REAL network latency already happened in fetchProducts() above)
  useEffect(() => {
    setLoading(true)
    const id = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(id)
  }, [filters, sort, categorySlug, brandSlug, quickFilter])

  const filtered = useMemo(() => applyFilters(scoped, filters), [scoped, filters])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])

  const pageTitle = category?.name ?? brand?.name ?? (quickFilter === 'new' ? 'New Arrivals' : quickFilter === 'flash-sale' ? 'Flash Sale' : 'All Products')

  function handleFiltersChange(next: ProductFilters) {
    setFilters(next)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">{pageTitle}</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{sorted.length} products</p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FiltersPanel
              filters={filters}
              facets={facets}
              onChange={handleFiltersChange}
              lockedCategoryId={category?.id}
              lockedBrandId={brand?.id}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden"
            >
              Filters
            </Button>
            <div className="ml-auto">
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>

          <ActiveFilterChips filters={filters} onChange={handleFiltersChange} maxPrice={facets.maxPrice} onClearAll={() => handleFiltersChange({})} />

          <ProductGrid
            products={sorted}
            loading={loading}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
            onClearFilters={() => handleFiltersChange({})}
          />
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="left" title="Filters" widthClassName="max-w-sm">
        <FiltersPanel
          filters={filters}
          facets={facets}
          onChange={handleFiltersChange}
          lockedCategoryId={category?.id}
          lockedBrandId={brand?.id}
        />
      </Drawer>
    </div>
  )
}