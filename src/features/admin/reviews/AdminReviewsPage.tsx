import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2, Star } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Rating } from '@/components/ui/Rating'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDeleteModal } from '@/components/shared/ConfirmDeleteModal'
import { useReviewsStore } from '@/store/useReviewsStore'
import { useProductsStore } from '@/store/useProductsStore'
import { useToast } from '@/components/ui/Toast'
import { formatDate, cn } from '@/lib/utils'

export default function AdminReviewsPage() {
  const reviews = useReviewsStore((s) => s.reviews)
  const fetchAllReviewsAdmin = useReviewsStore((s) => s.fetchAllReviewsAdmin)
  const removeReview = useReviewsStore((s) => s.removeReview)
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)
  const { toast } = useToast()

  useEffect(() => {
    fetchAllReviewsAdmin()
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [query, setQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const product = products.find((p) => p.id === r.productId)
      const q = query.trim().toLowerCase()
      const matchesQuery = !q || r.userName.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || product?.title.toLowerCase().includes(q)
      const matchesRating = ratingFilter === 'all' || Math.round(r.rating) === ratingFilter
      return matchesQuery && matchesRating
    })
  }, [reviews, products, query, ratingFilter])

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      // isAdmin=true — admin ke liye ownership-check nahi lagega
      await removeReview(deleteTarget, true)
      toast({ type: 'success', title: 'Review deleted' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to delete', description: err.response?.data?.message })
    }
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Reviews</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{reviews.length} total reviews across the catalog</p>
        </div>
        <div className="w-full sm:w-72">
          <Input placeholder="Search reviewer, title, product…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setRatingFilter('all')}
          className={cn(
            'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
            ratingFilter === 'all' ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950' : 'bg-porcelain-200 text-ink-700 dark:bg-ink-800 dark:text-porcelain-200',
          )}
        >
          All Ratings
        </button>
        {[5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setRatingFilter(r)}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
              ratingFilter === r ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950' : 'bg-porcelain-200 text-ink-700 dark:bg-ink-800 dark:text-porcelain-200',
            )}
          >
            {r} <Star className="h-3 w-3 fill-current" />
          </button>
        ))}
      </div>

      <div className="surface-card mt-5">
        {filtered.length === 0 ? (
          <EmptyState icon={<Star className="h-7 w-7" />} title="No reviews found" description="Try a different filter or search term." />
        ) : (
          <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
            {filtered.map((r) => {
              const product = products.find((p) => p.id === r.productId)
              return (
                <div key={r.id} className="flex items-start gap-4 p-5">
                  {product && <img src={product.images[0]?.url} alt={product.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{r.title}</p>
                      {r.verifiedPurchase && <Badge variant="success">Verified</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-ink-600 dark:text-porcelain-300/60">
                      {product?.title ?? 'Unknown product'} · by {r.userName} · {formatDate(r.createdAt)}
                    </p>
                    <Rating value={r.rating} className="mt-1.5" />
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-600 dark:text-porcelain-300/70">{r.comment}</p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(r.id)}
                    aria-label="Delete review"
                    className="shrink-0 rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this review?"
        description="This will permanently remove the review from the product page."
        onConfirm={handleDelete}
      />
    </div>
  )
}