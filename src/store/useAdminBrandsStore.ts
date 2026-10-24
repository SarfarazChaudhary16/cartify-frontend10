import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Brand } from '@/types'

interface BackendBrand {
  id: number
  name: string
  slug: string
  logo: string
  description: string
}

function mapBackendBrand(b: BackendBrand): Brand {
  return { id: String(b.id), name: b.name, slug: b.slug, logo: b.logo, description: b.description }
}

interface AdminBrandsState {
  brands: Brand[]
  loading: boolean
  fetchBrands: () => Promise<void>
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>
  updateBrand: (id: string, patch: Omit<Brand, 'id'>) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
}

export const useAdminBrandsStore = create<AdminBrandsState>((set) => ({
  brands: [],
  loading: false,

  fetchBrands: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendBrand[]>('/brands')
    set({ brands: response.data.map(mapBackendBrand), loading: false })
  },

  addBrand: async (brand) => {
    const response = await apiClient.post<BackendBrand>('/brands', brand)
    set((state) => ({ brands: [...state.brands, mapBackendBrand(response.data)] }))
  },

  updateBrand: async (id, patch) => {
    const response = await apiClient.put<BackendBrand>(`/brands/${id}`, patch)
    const updated = mapBackendBrand(response.data)
    set((state) => ({ brands: state.brands.map((b) => (b.id === id ? updated : b)) }))
  },

  deleteBrand: async (id) => {
    await apiClient.delete(`/brands/${id}`)
    set((state) => ({ brands: state.brands.filter((b) => b.id !== id) }))
  },
}))