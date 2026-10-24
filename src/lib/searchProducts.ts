import { products } from '@/mocks/products'
import { brands } from '@/mocks/brands'
import { categories } from '@/mocks/categories'
import type { Product } from '@/types'

/** Simple substring search across title, brand, category, and tags — good enough for the mock catalog. */
export function searchProducts(query: string, source: Product[] = products): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return source.filter((p) => {
    const brand = brands.find((b) => b.id === p.brandId)
    const category = categories.find((c) => c.id === p.categoryId)
    const haystack = [p.title, brand?.name, category?.name, ...p.tags].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

/** Curated shortcuts shown in the search dropdown and the no-results state. */
export const popularSearches = [
  'Running shoes',
  'Wireless earbuds',
  'Backpack',
  'Sunglasses',
  'Hoodie',
  'Smart watch',
  'Flash sale',
]