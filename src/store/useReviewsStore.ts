import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { ProductReview } from '@/types'

interface BackendReview {
  id: number
  productId: number
  userId: number
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  images: string[]
  verifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
}

function mapBackendReview(r: BackendReview): ProductReview {
  return {
    id: String(r.id),
    productId: String(r.productId),
    userId: String(r.userId),
    userName: r.userName,
    userAvatar: r.userAvatar,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    images: r.images && r.images.length > 0 ? r.images : undefined,
    helpfulCount: r.helpfulCount,
    verifiedPurchase: r.verifiedPurchase,
    createdAt: r.createdAt,
  }
}

interface AddReviewInput {
  productId: string
  rating: number
  title: string
  comment: string
}

interface ReviewsState {
  reviews: ProductReview[]
  loading: boolean

  fetchReviewsForProduct: (productId: string) => Promise<void>
  fetchMyReviews: () => Promise<void>
  fetchAllReviewsAdmin: () => Promise<void>

  addReview: (review: AddReviewInput) => Promise<void>
  removeReview: (id: string, isAdmin?: boolean) => Promise<void>
  toggleHelpful: (id: string) => Promise<void>
  resetLocal: () => void
}

/**
 * Reviews ab REAL backend (/api/reviews) se juda hai. NOTE: Review-photo
 * upload backend ko NAHI bheja jata — WriteReviewModal.tsx jo local
 * blob-URLs banata hai (URL.createObjectURL), wo sirf isi browser-session
 * mein valid hoti hain, backend mein persist nahi ho sakti (koi image-
 * upload API humne banaya hi nahi tha is project mein abhi tak).
 *
 * "helpfulCount" ke liye: backend PER-USER duplicate-click track nahi
 * karta (simplified implementation) — matlab wahi user baar-baar click
 * kare to count badhta rahega. Ye ek KNOWN limitation hai, cosmetic UI
 * lock local component-state se lagayenge (session ke liye), backend
 * se guaranteed nahi hai.
 */
export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  loading: false,

  fetchReviewsForProduct: async (productId) => {
    set({ loading: true })
    const response = await apiClient.get<BackendReview[]>(`/reviews/product/${productId}`)
    set({ reviews: response.data.map(mapBackendReview), loading: false })
  },

  fetchMyReviews: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendReview[]>('/reviews/my-reviews')
    set({ reviews: response.data.map(mapBackendReview), loading: false })
  },

  fetchAllReviewsAdmin: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendReview[]>('/reviews/admin/all')
    set({ reviews: response.data.map(mapBackendReview), loading: false })
  },

  addReview: async (review) => {
    const response = await apiClient.post<BackendReview>('/reviews', {
      productId: Number(review.productId),
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: [], // NOTE: image-upload backend ko support nahi hai abhi
    })
    const created = mapBackendReview(response.data)
    set((state) => ({ reviews: [created, ...state.reviews] }))
  },

  removeReview: async (id, isAdmin = false) => {
    const url = isAdmin ? `/reviews/admin/${id}` : `/reviews/${id}`
    await apiClient.delete(url)
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) }))
  },

  toggleHelpful: async (id) => {
    const response = await apiClient.put<BackendReview>(`/reviews/${id}/helpful`)
    const updated = mapBackendReview(response.data)
    set((state) => ({ reviews: state.reviews.map((r) => (r.id === id ? updated : r)) }))
  },
  resetLocal: () => set({ reviews: [] }),
}))