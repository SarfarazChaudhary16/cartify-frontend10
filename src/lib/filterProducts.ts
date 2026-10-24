import type { Product, ProductFilters, SortOption } from '@/types'

/** Pure filtering — no side effects, safe to unit test and safe to later mirror server-side. */
export function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.categoryIds?.length && !filters.categoryIds.includes(p.categoryId)) return false
    if (filters.brandIds?.length && !filters.brandIds.includes(p.brandId)) return false
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      if (p.price < min || p.price > max) return false
    }
    if (filters.minRating && p.rating < filters.minRating) return false
    if (filters.colors?.length) {
      const productColors = p.colors?.map((c) => c.name) ?? []
      if (!filters.colors.some((c) => productColors.includes(c))) return false
    }
    if (filters.sizes?.length) {
      if (!filters.sizes.some((s) => p.sizes?.includes(s))) return false
    }
    if (filters.minDiscount && (p.discountPercent ?? 0) < filters.minDiscount) return false
    if (filters.inStockOnly && p.stock <= 0) return false
    if (filters.materials?.length && (!p.material || !filters.materials.includes(p.material))) return false
    return true
  })
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'price_low_high':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_high_low':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'discount':
      return sorted.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    case 'relevance':
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
  }
}

export interface FilterFacets {
  colors: { name: string; hex: string }[]
  sizes: string[]
  materials: string[]
  maxPrice: number
}

/** Derives available filter options (and their bounds) directly from the catalog. */
export function getFilterFacets(products: Product[]): FilterFacets {
  const colorMap = new Map<string, string>()
  const sizes = new Set<string>()
  const materials = new Set<string>()
  let maxPrice = 0

  for (const p of products) {
    p.colors?.forEach((c) => colorMap.set(c.name, c.hex))
    p.sizes?.forEach((s) => sizes.add(s))
    if (p.material) materials.add(p.material)
    if (p.price > maxPrice) maxPrice = p.price
  }

  return {
    colors: Array.from(colorMap, ([name, hex]) => ({ name, hex })),
    sizes: Array.from(sizes),
    materials: Array.from(materials),
    maxPrice: Math.ceil(maxPrice / 1000) * 1000,
  }
}

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low_high', label: 'Price: Low to High' },
  { value: 'price_high_low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Discount' },
]