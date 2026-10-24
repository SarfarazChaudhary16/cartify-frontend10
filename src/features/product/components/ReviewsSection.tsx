import { useEffect, useState } from 'react'
import { ThumbsUp, BadgeCheck } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { WriteReviewModal } from './WriteReviewModal'
import { useReviewsStore } from '@/store/useReviewsStore'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

export function ReviewsSection({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false)
  const reviews = useReviewsStore((s) => s.reviews)
  const fetchReviewsForProduct = useReviewsStore((s) => s.fetchReviewsForProduct)
  const toggleHelpful = useReviewsStore((s) => s.toggleHelpful)

  // Cosmetic-only "already marked helpful in this session" tracking —
  // backend nahi bhejता ki KIS USER ne helpful maara (simplified
  // implementation), isliye ye purely local/session-level UI hai
  const [helpfulIds, setHelpfulIds] = useState<string[]>([])

  useEffect(() => {
    fetchReviewsForProduct(product.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  async function handleToggleHelpful(reviewId: string) {
    if (helpfulIds.includes(reviewId)) return // ek baar hi mark karne dete hain (cosmetic guard)
    setHelpfulIds((prev) => [...prev, reviewId])
    await toggleHelpful(reviewId)
  }

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, pct }
  })

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[220px_1fr]">
        <div>
          <p className="font-display text-4xl font-medium text-ink-950 dark:text-porcelain-100">{product.rating.toFixed(1)}</p>
          <Rating value={product.rating} size="md" className="mt-1" />
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{product.reviewCount.toLocaleString('en-IN')} ratings</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setModalOpen(true)}>
            Write a review
          </Button>

          <div className="mt-5 space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-xs text-ink-600 dark:text-porcelain-300/60">
                <span className="w-6">{b.star}★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-porcelain-200 dark:bg-ink-800">
                  <span className="block h-full rounded-full bg-gold-500" style={{ width: `${b.pct}%` }} />
                </span>
                <span className="w-8 text-right">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {reviews.length === 0 ? (
            <EmptyState title="No reviews yet" description="Be the first to share what you think of this product." />
          ) : (
            <div className="space-y-6">
              {reviews.map((r) => {
                const marked = helpfulIds.includes(r.id)
                return (
                  <div key={r.id} className="border-b border-porcelain-300 pb-6 last:border-0 dark:border-ink-700">
                    <div className="flex items-center justify-between">
                      <Rating value={r.rating} />
                      <span className="text-xs text-ink-600 dark:text-porcelain-300/50">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{r.comment}</p>

                    {r.images && r.images.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {r.images.map((src, i) => (
                          <img key={i} src={src} alt={`Review photo ${i + 1}`} className="h-16 w-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-ink-950 dark:text-porcelain-100">
                        {r.userName}
                        {r.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-success-500">
                            <BadgeCheck className="h-3.5 w-3.5" /> Verified
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleToggleHelpful(r.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-ink-600 transition-colors hover:text-cobalt-600 dark:text-porcelain-300/60 dark:hover:text-cobalt-400"
                      >
                        <ThumbsUp className={cn('h-3.5 w-3.5', marked && 'fill-cobalt-500 text-cobalt-500')} />
                        Helpful ({r.helpfulCount})
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <WriteReviewModal open={modalOpen} onClose={() => setModalOpen(false)} productId={product.id} productTitle={product.title} />
    </div>
  )
}