import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Category } from '@/types'

interface BackendCategory {
  id: number
  name: string
  slug: string
  image: string
  productCount: number
}

function mapBackendCategory(c: BackendCategory): Category {
  return { id: String(c.id), name: c.name, slug: c.slug, image: c.image, productCount: c.productCount }
}

interface AdminCategoriesState {
  categories: Category[]
  loading: boolean
  fetchCategories: () => Promise<void>
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Promise<void>
  updateCategory: (id: string, patch: Omit<Category, 'id' | 'productCount'>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useAdminCategoriesStore = create<AdminCategoriesState>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendCategory[]>('/categories')
    set({ categories: response.data.map(mapBackendCategory), loading: false })
  },

  addCategory: async (category) => {
    const response = await apiClient.post<BackendCategory>('/categories', category)
    set((state) => ({ categories: [...state.categories, mapBackendCategory(response.data)] }))
  },

  updateCategory: async (id, patch) => {
    const response = await apiClient.put<BackendCategory>(`/categories/${id}`, patch)
    const updated = mapBackendCategory(response.data)
    set((state) => ({ categories: state.categories.map((c) => (c.id === id ? updated : c)) }))
  },

  deleteCategory: async (id) => {
    await apiClient.delete(`/categories/${id}`)
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }))
  },
}))