import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

interface BackendWishlistItem {
  id: number
  productId: number
}

interface WishlistState {
  productIds: string[]
  loading: boolean
  fetchWishlist: () => Promise<void>
  toggle: (productId: string) => Promise<void>
  has: (productId: string) => boolean
  count: () => number
  resetLocal: () => void
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true })
    try {
      const response = await apiClient.get<BackendWishlistItem[]>('/wishlist')
      // DEBUG: temporary log, hatane wale hain jab issue solve ho jaye
      console.log('Wishlist API response:', response.data)
      // DEFENSIVE FIX: kabhi-kabhi backend se aane wala JSON-key ka
      // casing expected se match nahi karta (jaise "productId" ki
      // jagah "productid"). Yahan dono cases handle kar rahe hain
      // taaki chahe jo bhi casing aaye, sahi productId mile.
      const rawItems = response.data as any[]
      const ids = rawItems.map((item) => String(item.productId ?? item.productid))
      set({ productIds: ids, loading: false })
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
      set({ loading: false })
    }
  },

  toggle: async (productId) => {
    const currentlyInWishlist = get().productIds.includes(productId)

    set((state) => ({
      productIds: currentlyInWishlist
        ? state.productIds.filter((id) => id !== productId)
        : [...state.productIds, productId],
    }))

    try {
      if (currentlyInWishlist) {
        await apiClient.delete(`/wishlist/${productId}`)
      } else {
        await apiClient.post(`/wishlist/${productId}`)
      }
    } catch (err) {
      set((state) => ({
        productIds: currentlyInWishlist
          ? [...state.productIds, productId]
          : state.productIds.filter((id) => id !== productId),
      }))
      throw err
    }
  },

  has: (productId) => get().productIds.includes(productId),
  count: () => get().productIds.length,

  resetLocal: () => set({ productIds: [] }),
}))