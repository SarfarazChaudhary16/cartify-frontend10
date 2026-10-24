import { SearchX } from 'lucide-react'
import { ProductCard } from '@/components/shared/ProductCard'
import { SkeletonProductCard } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

export interface ProductGridProps {
  products: Product[]
  loading: boolean
  visibleCount: number
  onLoadMore: () => void
  onClearFilters: () => void
}

export function ProductGrid({ products, loading, visibleCount, onLoadMore, onClearFilters }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-7 w-7" />}
        title="No products match your filters"
        description="Try removing a filter or two — there's more in the catalog than this."
        action={
          <Button variant="outline" onClick={onClearFilters}>
            Clear all filters
          </Button>
        }
      />
    )
  }

  const visible = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            Load more ({products.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}