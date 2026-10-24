import type { Category } from '@/types'
export const categories: Category[] = [
  { id: 'cat-1', name: 'Sneakers & Footwear', slug: 'sneakers-footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', productCount: 128 },
  { id: 'cat-2', name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', productCount: 214 },
  { id: 'cat-3', name: 'Bags & Backpacks', slug: 'bags-backpacks', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', productCount: 76 },
  { id: 'cat-4', name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600', productCount: 54 },
  { id: 'cat-5', name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', productCount: 41 },
  { id: 'cat-6', name: 'Eyewear', slug: 'eyewear', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', productCount: 38 },
  { id: 'cat-7', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', productCount: 97 },
  { id: 'cat-8', name: 'Fitness & Outdoor', slug: 'fitness-outdoor', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600', productCount: 63 },
]

export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)