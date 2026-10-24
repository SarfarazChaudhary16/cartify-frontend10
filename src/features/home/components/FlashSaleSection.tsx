import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/shared/ProductCard'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { getFlashSaleProducts } from '@/mocks/products'

/** Flash Sale banner with a live countdown, in its own high-contrast section for urgency. */
export function FlashSaleSection() {
  const products = getFlashSaleProducts()
  const target = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 6 + 1000 * 60 * 23), [])

  if (products.length === 0) return null

  return (
    <section className="bg-ink-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
              <Zap className="h-5 w-5" fill="currentColor" />
            </span>
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-gold-400">Ends soon</p>
              <h2 className="font-display text-2xl font-medium text-porcelain-100 sm:text-3xl">Flash Sale</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CountdownTimer target={target} />
            <Link
              to="/products?filter=flash-sale"
              className="group hidden items-center gap-1.5 text-sm font-medium text-porcelain-100 sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}