import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/shared/ProductCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import type { Product } from '@/types'

export interface ProductRailProps {
  eyebrow?: string
  title: string
  description?: string
  viewAllHref?: string
  products: Product[]
}

/**
 * Horizontally-scrolling product row with arrow controls. Reused for
 * Trending, Deals, New Arrivals, Best Sellers, Recommended, Recently Viewed.
 */
export function ProductRail({ eyebrow, title, description, viewAllHref, products }: ProductRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} viewAllHref={viewAllHref} className="mb-6" />

      <div className="relative">
        <div ref={scrollerRef} className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} className="w-64 shrink-0 sm:w-72" />
          ))}
        </div>

        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-porcelain-300 bg-white text-ink-950 shadow-md transition-transform hover:scale-105 md:flex dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-porcelain-300 bg-white text-ink-950 shadow-md transition-transform hover:scale-105 md:flex dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}