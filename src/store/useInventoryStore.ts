import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Product } from '@/types'

interface BackendProductImage {
  id: number
  url: string
  alt: string
}

interface BackendProduct {
  id: number
  slug: string
  title: string
  description: string
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  stock: number
  material?: string
  new: boolean
  bestSeller: boolean
  flashSale: boolean
  discountPercent?: number
  createdAt: string
  brandId: number
  categoryId: number
  images: BackendProductImage[]
  variants: any[]
  colors: any[]
  specifications: any[]
  tags: string[]
  sizes: string[]
}

function mapBackendProduct(p: BackendProduct): Product {
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    brandId: String(p.brandId),
    categoryId: String(p.categoryId),
    description: p.description,
    images: p.images.map((img) => ({ id: String(img.id), url: img.url, alt: img.alt })),
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    currency: 'INR',
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    tags: p.tags ?? [],
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    variants: p.variants ?? [],
    specifications: p.specifications ?? [],
    isNew: p.new,
    isBestSeller: p.bestSeller,
    isFlashSale: p.flashSale,
    discountPercent: p.discountPercent,
    material: p.material,
    createdAt: p.createdAt,
  }
}

export interface InventoryHistoryEntry {
  id: string
  productId: string
  productTitle: string
  change: number
  previousStock: number
  newStock: number
  reason: string
  timestamp: string
}

interface BackendHistoryEntry {
  id: number
  productId: number
  productTitle: string
  change: number
  previousStock: number
  newStock: number
  reason: string
  createdAt: string
}

function mapBackendHistory(h: BackendHistoryEntry): InventoryHistoryEntry {
  return {
    id: String(h.id),
    productId: String(h.productId),
    productTitle: h.productTitle,
    change: h.change,
    previousStock: h.previousStock,
    newStock: h.newStock,
    reason: h.reason,
    timestamp: h.createdAt,
  }
}

interface InventoryState {
  products: Product[]
  history: InventoryHistoryEntry[]
  loading: boolean

  fetchProducts: () => Promise<void>
  fetchHistory: () => Promise<void>
  adjustStock: (productId: string, change: number, reason: string) => Promise<void>
}

/**
 * Admin Inventory — ab REAL backend (/api/admin/inventory) se juda hai.
 * NOTE: Ye purani AdminProductsStore/InventoryHistoryStore se ALAG,
 * dedicated store hai — kyunki Inventory-page ka data-shape (stock-focus)
 * aur backend-endpoints dono alag/specific hain.
 */
export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  history: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendProduct[]>('/admin/inventory/products')
    set({ products: response.data.map(mapBackendProduct), loading: false })
  },

  fetchHistory: async () => {
    const response = await apiClient.get<BackendHistoryEntry[]>('/admin/inventory/history')
    set({ history: response.data.map(mapBackendHistory) })
  },

  adjustStock: async (productId, change, reason) => {
    const response = await apiClient.post<BackendProduct>(`/admin/inventory/${productId}/adjust`, {
      change,
      reason,
    })
    const updated = mapBackendProduct(response.data)
    set((state) => ({ products: state.products.map((p) => (p.id === productId ? updated : p)) }))
  },
}))