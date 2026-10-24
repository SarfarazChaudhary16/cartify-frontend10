import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Product } from '@/types'

interface BackendProductImage {
  id: number
  url: string
  alt: string
}

interface BackendProductVariant {
  id: number
  color?: string
  size?: string
  sku: string
  stock: number
}

interface BackendProductColor {
  name: string
  hex: string
}

interface BackendProductSpec {
  label: string
  value: string
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
  variants: BackendProductVariant[]
  colors: BackendProductColor[]
  specifications: BackendProductSpec[]
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
    variants: (p.variants ?? []).map((v) => ({ id: String(v.id), color: v.color, size: v.size, sku: v.sku, stock: v.stock })),
    specifications: p.specifications ?? [],
    isNew: p.new,
    isBestSeller: p.bestSeller,
    isFlashSale: p.flashSale,
    discountPercent: p.discountPercent,
    material: p.material,
    createdAt: p.createdAt,
  }
}

/**
 * Frontend ke Product (form-shape) ko backend ke ProductRequest JSON mein
 * convert karta hai. IMPORTANT: Jackson JSON property-naam Java ke SETTER
 * naam se nikalta hai (setNew/setBestSeller/setFlashSale) — jisse "is"
 * prefix hat jata hai. Isliye backend ko bhejte waqt bhi keys
 * "new"/"bestSeller"/"flashSale" honi chahiye, "isNew" waghera NAHI —
 * bilkul wahi quirk jo hum read-side (useProductsStore.ts) mein bhi
 * handle kar chuke hain, bas yahan ULTI direction mein.
 */
function toRequestPayload(product: Omit<Product, 'id' | 'createdAt'>) {
  return {
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice || undefined,
    stock: product.stock,
    material: product.material || undefined,
    brandId: Number(product.brandId),
    categoryId: Number(product.categoryId),
    new: !!product.isNew,
    bestSeller: !!product.isBestSeller,
    flashSale: !!product.isFlashSale,
    discountPercent: product.discountPercent,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    tags: product.tags ?? [],
    specifications: product.specifications ?? [],
    variants: (product.variants ?? []).map((v) => ({ color: v.color, size: v.size, sku: v.sku, stock: v.stock })),
  }
}

interface AdminProductsState {
  products: Product[]
  loading: boolean
  fetchProducts: () => Promise<void>
  getProduct: (id: string) => Product | undefined
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>
  updateProduct: (id: string, product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  bulkDelete: (ids: string[]) => Promise<void>
  bulkSetFlag: (ids: string[], flag: 'isNew' | 'isBestSeller' | 'isFlashSale', value: boolean) => Promise<void>
}

/**
 * Admin-side product catalog — ab REAL backend (/api/products) se juda
 * hai. GET public hai, POST/PUT/DELETE ADMIN-role JWT maangte hain
 * (apiClient ka interceptor token automatically attach kar deta hai).
 */
export const useAdminProductsStore = create<AdminProductsState>((set, get) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendProduct[]>('/products')
    set({ products: response.data.map(mapBackendProduct), loading: false })
  },

  getProduct: (id) => get().products.find((p) => p.id === id),

  addProduct: async (product) => {
    const response = await apiClient.post<BackendProduct>('/products', toRequestPayload(product))
    const created = mapBackendProduct(response.data)
    set((state) => ({ products: [created, ...state.products] }))
    return created
  },

  updateProduct: async (id, product) => {
    const response = await apiClient.put<BackendProduct>(`/products/${id}`, toRequestPayload(product))
    const updated = mapBackendProduct(response.data)
    set((state) => ({ products: state.products.map((p) => (p.id === id ? updated : p)) }))
  },

  deleteProduct: async (id) => {
    await apiClient.delete(`/products/${id}`)
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
  },

  bulkDelete: async (ids) => {
    await Promise.all(ids.map((id) => apiClient.delete(`/products/${id}`)))
    set((state) => ({ products: state.products.filter((p) => !ids.includes(p.id)) }))
  },

  bulkSetFlag: async (ids, flag, value) => {
    // Backend ka PUT poora product REPLACE karta hai (partial-patch
    // support nahi hai), isliye har product ke liye poora payload
    // dobara bhejna padta hai — bas "flag" wali field badalke.
    const targets = get().products.filter((p) => ids.includes(p.id))
    for (const product of targets) {
      const { id, createdAt, ...rest } = product
      await get().updateProduct(id, { ...rest, [flag]: value })
    }
  },
}))