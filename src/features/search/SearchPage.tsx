import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { NoResultsState } from './NoResultsState'
import { FiltersPanel } from '@/features/catalog/components/FiltersPanel'
import { SortDropdown } from '@/features/catalog/components/SortDropdown'
import { ActiveFilterChips } from '@/features/catalog/components/ActiveFilterChips'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { useProductsStore } from '@/store/useProductsStore'
import { applyFilters, sortProducts, getFilterFacets } from '@/lib/filterProducts'
import { useSearchHistoryStore } from '@/store/useSearchHistoryStore'
import type { ProductFilters, SortOption } from '@/types'

const PAGE_SIZE = 8

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const addHistory = useSearchHistoryStore((s) => s.add)

  // NAYA: mocks/searchProducts.ts (purani static file) ki jagah ab
  // REAL backend-backed useProductsStore ka searchProducts() use karte
  // hain — jismein synonym-matching bhi already ban chuki hai
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)
  const searchProducts = useProductsStore((s) => s.searchProducts)

  useEffect(() => {
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const matches = useMemo(() => searchProducts(query), [query, products])
  const facets = useMemo(() => getFilterFacets(matches), [matches])

  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<SortOption>('relevance')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    if (query.trim()) addHistory(query)
    setFilters({})
    setVisibleCount(PAGE_SIZE)
  }, [query, addHistory])

  useEffect(() => {
    setLoading(true)
    const id = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(id)
  }, [query, filters, sort])

  const filtered = useMemo(() => applyFilters(matches, filters), [matches, filters])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])

  function handleFiltersChange(next: ProductFilters) {
    setFilters(next)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}
        </h1>
        {query && !loading && <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{sorted.length} products found</p>}
      </div>

      {!query.trim() ? (
        <NoResultsState query="" onPick={(term) => setSearchParams({ q: term })} />
      ) : !loading && matches.length === 0 ? (
        <NoResultsState query={query} onPick={(term) => setSearchParams({ q: term })} />
      ) : (
        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <FiltersPanel filters={filters} facets={facets} onChange={handleFiltersChange} />
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
      )}

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} side="left" title="Filters" widthClassName="max-w-sm">
        <FiltersPanel filters={filters} facets={facets} onChange={handleFiltersChange} />
      </Drawer>
    </div>
  )
}