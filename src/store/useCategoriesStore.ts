import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Category } from '@/types'

// Backend CategoryResponse ka RAW shape — id yahan NUMBER hai (Java Long),
// frontend ke Category type mein STRING chahiye, isliye mapper mein convert karenge
interface BackendCategory {
  id: number
  name: string
  slug: string
  image: string
  productCount: number
}

function mapBackendCategory(c: BackendCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    image: c.image,
    productCount: c.productCount,
  }
}

interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  getCategoryBySlug: (slug: string) => Category | undefined
}

/**
 * Real backend se categories laata hai (GET /api/categories) — public
 * endpoint hai, koi login nahi chahiye. Header ke mega-menu, Home page
 * "Featured Categories", aur Catalog page filters — sab isi store se
 * data lenge.
 */
export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.get<BackendCategory[]>('/categories')
      const mapped = response.data.map(mapBackendCategory)
      set({ categories: mapped, loading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Failed to load categories', loading: false })
    }
  },

  // Mock-version mein ye function seedha array-filter tha — ab store
  // ke already-fetched "categories" array mein hi dhoondhta hai (koi
  // extra API-call nahi lagti, jab tak fetchCategories() ek baar chal chuka ho)
  getCategoryBySlug: (slug) => get().categories.find((c) => c.slug === slug),
}))