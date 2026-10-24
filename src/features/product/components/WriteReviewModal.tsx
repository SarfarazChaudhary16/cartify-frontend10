import { useRef, useState } from 'react'
import { Star, ImagePlus, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useReviewsStore } from '@/store/useReviewsStore'
import { cn } from '@/lib/utils'

const MAX_IMAGES = 4

export function WriteReviewModal({ open, onClose, productId, productTitle }: { open: boolean; onClose: () => void; productId: string; productTitle: string }) {
  const addReview = useReviewsStore((s) => s.addReview)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ rating?: string; title?: string; comment?: string }>({})

  function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = MAX_IMAGES - images.length
    const next = Array.from(files)
      .slice(0, remaining)
      .map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...next])
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function resetAndClose() {
    setRating(0)
    setTitle('')
    setComment('')
    setImages([])
    setErrors({})
    onClose()
  }

  async function handleSubmit() {
    const nextErrors: typeof errors = {}
    if (rating === 0) nextErrors.rating = 'Please select a rating.'
    if (!title.trim()) nextErrors.title = 'Give your review a title.'
    if (comment.trim().length < 10) nextErrors.comment = 'Write at least 10 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      // NOTE: images YAHAN backend ko NAHI bhej rahe — WriteReviewModal
      // ke local blob-URLs sirf is browser-tab mein valid hote hain,
      // backend mein persist nahi ho sakte (koi upload-API nahi hai).
      // "Verified Purchase" badge bhi ab CLIENT se nahi bhejte — backend
      // KHUD check karta hai order-history dekh ke (security ke liye,
      // taaki koi bina-khareede fake-badge na le sake).
      await addReview({
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      })
      toast({ type: 'success', title: 'Review submitted', description: 'Thanks for sharing your feedback!' })
      resetAndClose()
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to submit review', description: err.response?.data?.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={`Review: ${productTitle}`} size="md">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-medium text-ink-950 dark:text-porcelain-100">Your rating</p>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onMouseEnter={() => setHoverRating(i)} onClick={() => setRating(i)} aria-label={`${i} star${i > 1 ? 's' : ''}`}>
                <Star className={cn('h-7 w-7 transition-colors', (hoverRating || rating) >= i ? 'fill-gold-500 text-gold-500' : 'text-porcelain-300 dark:text-ink-700')} />
              </button>
            ))}
          </div>
          {errors.rating && <p className="mt-1 text-xs font-medium text-danger-500">{errors.rating}</p>}
        </div>

        <Input label="Title" placeholder="Sum up your experience" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
        <Textarea
          label="Review"
          placeholder="What did you like or dislike? How does it fit / perform?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={errors.comment}
          rows={4}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink-950 dark:text-porcelain-100">
            Add photos (optional — preview only, not saved with your review yet)
          </p>
          <div className="flex flex-wrap gap-2.5">
            {images.map((src, i) => (
              <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg">
                <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                  className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink-950/70 text-white"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-porcelain-300 text-ink-600 transition-colors hover:border-cobalt-500 hover:text-cobalt-600 dark:border-ink-700 dark:text-porcelain-300/60"
              >
                <ImagePlus className="h-4 w-4" />
                <span className="text-[10px] font-medium">Add</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={resetAndClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={submitting}>
          Submit Review
        </Button>
      </div>
    </Modal>
  )
}