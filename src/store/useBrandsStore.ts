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
  return {
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    description: b.description,
  }
}

interface BrandsState {
  brands: Brand[]
  loading: boolean
  error: string | null
  fetchBrands: () => Promise<void>
  getBrandBySlug: (slug: string) => Brand | undefined
}

export const useBrandsStore = create<BrandsState>((set, get) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.get<BackendBrand[]>('/brands')
      set({ brands: response.data.map(mapBackendBrand), loading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Failed to load brands', loading: false })
    }
  },

  getBrandBySlug: (slug) => get().brands.find((b) => b.slug === slug),
}))