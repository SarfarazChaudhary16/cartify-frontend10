import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Product } from '@/types'

// Backend ProductResponse ka RAW shape. Dhyan do: "new"/"bestSeller"/
// "flashSale" — "is" prefix Jackson ki wajah se GAYAB hai JSON mein
// (upar explain kiya tha). "currency" backend bhejta hi nahi (hum
// hamesha 'INR' hardcode kar denge, kyunki poora app abhi sirf INR mein hai).
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
  new: boolean          // "isNew" Java field -> "new" JSON key
  bestSeller: boolean    // "isBestSeller" -> "bestSeller"
  flashSale: boolean     // "isFlashSale" -> "flashSale"
  discountPercent?: number
  createdAt: string
  brandId: number
  brandName: string
  brandSlug: string
  categoryId: number
  categoryName: string
  categorySlug: string
  images: BackendProductImage[]
  variants: BackendProductVariant[]
  colors: BackendProductColor[]
  specifications: BackendProductSpec[]
  tags: string[]
  sizes: string[]
}

/**
 * Backend product ko frontend ke Product-shape mein convert karta hai.
 * NOTE: brandSlug/categorySlug ko hum Product type mein directly nahi
 * daal sakte (wo type mein sirf brandId/categoryId maangta hai) — lekin
 * hum inhe niche ek ALAG "ExtendedProduct" type se expose karenge, taaki
 * CatalogPage/ProductDetailPage inhe seedha use kar sakein bina alag se
 * Brand/Category dhoondhe (jo mock-data mein bhi zaroori padta tha).
 */
export interface ExtendedProduct extends Product {
  brandName: string
  brandSlug: string
  categoryName: string
  categorySlug: string
}

function mapBackendProduct(p: BackendProduct): ExtendedProduct {
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
    variants: (p.variants ?? []).map((v) => ({
      id: String(v.id),
      color: v.color,
      size: v.size,
      sku: v.sku,
      stock: v.stock,
    })),
    specifications: p.specifications ?? [],
    isNew: p.new,
    isBestSeller: p.bestSeller,
    isFlashSale: p.flashSale,
    discountPercent: p.discountPercent,
    material: p.material,
    createdAt: p.createdAt,
    brandName: p.brandName,
    brandSlug: p.brandSlug,
    categoryName: p.categoryName,
    categorySlug: p.categorySlug,
  }
}

interface ProductsState {
  products: ExtendedProduct[]
  loading: boolean
  error: string | null

  // Poora catalog EK BAAR fetch karta hai (GET /api/products) — chhota
  // catalog (50 products) hai, isliye sab kuch ek saath la ke, frontend
  // mein hi filter/search karna simplest aur fast approach hai (mock-data
  // ka behavior bhi yahi tha — sab kuch client-side filter hota tha)
  fetchProducts: () => Promise<void>

  getProductBySlug: (slug: string) => ExtendedProduct | undefined
  getProductsByCategorySlug: (categorySlug: string) => ExtendedProduct[]
  getProductsByBrandSlug: (brandSlug: string) => ExtendedProduct[]
  searchProducts: (keyword: string) => ExtendedProduct[]
  getNewArrivals: () => ExtendedProduct[]
  getBestSellers: () => ExtendedProduct[]
  getFlashSaleProducts: () => ExtendedProduct[]
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.get<BackendProduct[]>('/products')
      set({ products: response.data.map(mapBackendProduct), loading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Failed to load products', loading: false })
    }
  },

  getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),

  // NOTE: Ye ab "categorySlug" se filter karta hai, "categoryId" se
  // NAHI — kyunki route hamesha /category/:categorySlug hota hai, aur
  // har product ke andar categorySlug already embedded hai (backend se),
  // isliye alag se Category-lookup karne ki zarurat nahi padi
  getProductsByCategorySlug: (categorySlug) => get().products.filter((p) => p.categorySlug === categorySlug),

  getProductsByBrandSlug: (brandSlug) => get().products.filter((p) => p.brandSlug === brandSlug),

  searchProducts: (keyword) => {
    const q = keyword.trim().toLowerCase()
    if (!q) return []

    // ===== SYNONYM MAPPING =====
    // User aksar "shoes", "t shirt" jaise GENERIC/casual words search
    // karта hai — lekin humारे product-titles mein literally "shoe" ya
    // "shirt" word nahi hota (jaise "Northline Strider Runner" mein
    // kahin "shoe" nahi likha, chahe wo category "Sneakers & Footwear"
    // hai). Isliye ek mapping banate hain: "agar query in synonyms mein
    // se koi match kare, to us CATEGORY ke saare products bhi include karo"
    const categorySynonyms: Record<string, string[]> = {
      'sneakers-footwear': ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear', 'boot', 'boots', 'sandal', 'sandals', 'slipper', 'slippers'],
      'apparel': ['shirt', 'shirts', 't shirt', 'tshirt', 't-shirt', 'tee', 'tees', 'hoodie', 'hoodies', 'jacket', 'jackets', 'pant', 'pants', 'jogger', 'joggers', 'sweater', 'sweaters', 'clothes', 'clothing', 'apparel', 'top', 'tops'],
      'bags-backpacks': ['bag', 'bags', 'backpack', 'backpacks', 'duffel', 'tote', 'sling', 'messenger', 'luggage'],
      'watches': ['watch', 'watches', 'timepiece', 'timepieces'],
      'audio': ['headphone', 'headphones', 'earbud', 'earbuds', 'speaker', 'speakers', 'earphone', 'earphones', 'audio'],
      'eyewear': ['sunglass', 'sunglasses', 'glasses', 'shades', 'eyewear', 'goggles'],
    }

    // Query kaunse category-slug(s) se match karti hai, wo dhoondte hain
    const matchedCategorySlugs = Object.entries(categorySynonyms)
      .filter(([, synonyms]) => synonyms.some((syn) => syn.includes(q) || q.includes(syn)))
      .map(([slug]) => slug)

    return get().products.filter((p) => {
      const matchesDirectly =
        p.title.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))

      const matchesViaSynonym = matchedCategorySlugs.includes(p.categorySlug)

      return matchesDirectly || matchesViaSynonym
    })
  },

  getNewArrivals: () => get().products.filter((p) => p.isNew),
  getBestSellers: () => get().products.filter((p) => p.isBestSeller),
  getFlashSaleProducts: () => get().products.filter((p) => p.isFlashSale),
}))