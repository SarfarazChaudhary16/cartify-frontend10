import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Trash2 } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useReviewsStore } from '@/store/useReviewsStore'
import { useProductsStore } from '@/store/useProductsStore'
import { formatDate } from '@/lib/utils'

export default function MyReviewsPage() {
  const reviews = useReviewsStore((s) => s.reviews)
  const fetchMyReviews = useReviewsStore((s) => s.fetchMyReviews)
  const removeReview = useReviewsStore((s) => s.removeReview)
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)
  const { toast } = useToast()

  useEffect(() => {
    fetchMyReviews()
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleDelete(id: string) {
    try {
      await removeReview(id)
      toast({ type: 'info', title: 'Review deleted' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to delete', description: err.response?.data?.message })
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">My Reviews</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Reviews you've written for products you've bought.</p>

      {reviews.length === 0 ? (
        <div className="surface-card mt-6">
          <EmptyState
            icon={<Star className="h-7 w-7" />}
            title="No reviews yet"
            description="Reviews you write on product pages will show up here."
            action={
              <Link to="/products">
                <Button variant="outline">Browse Products</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((r) => {
            const product = products.find((p) => p.id === r.productId)
            return (
              <div key={r.id} className="surface-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {product && (
                      <img src={product.images[0]?.url} alt={product.title} className="h-12 w-12 rounded-lg object-cover" />
                    )}
                    <div>
                      {product ? (
                        <Link to={`/product/${product.slug}`} className="text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
                          {product.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">Product</p>
                      )}
                      <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    aria-label="Delete review"
                    className="rounded-lg p-1.5 text-ink-600 hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Rating value={r.rating} className="mt-3" />
                <p className="mt-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{r.comment}</p>

                <p className="mt-3 text-xs text-ink-600 dark:text-porcelain-300/60">{r.helpfulCount} people found this helpful</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}