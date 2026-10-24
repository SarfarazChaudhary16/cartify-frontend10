import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { categories } from '@/mocks/categories'
import { brands } from '@/mocks/brands'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

/** "Shop" nav item — opens on hover (desktop) or click, showing categories + brand shortcuts. */
export function MegaMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-ink-950/[0.05] dark:text-porcelain-100 dark:hover:bg-white/[0.06]"
      >
        Shop
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-40 mt-2 w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-porcelain-300 bg-white shadow-2xl dark:border-ink-700 dark:bg-ink-900"
          >
            <div className="grid grid-cols-3 gap-6 p-6">
              <div className="col-span-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-porcelain-100 dark:hover:bg-ink-800"
                    >
                      <img src={c.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{c.name}</p>
                        <p className="price text-xs text-ink-600 dark:text-porcelain-300/60">{c.productCount} items</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">
                  Top Brands
                </p>
                <div className="flex flex-col gap-1">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      to={`/brand/${b.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-2 py-1.5 text-sm text-ink-950 transition-colors hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="block border-t border-porcelain-300 bg-porcelain-100 px-6 py-3 text-center text-sm font-medium text-cobalt-600 transition-colors hover:bg-porcelain-200 dark:border-ink-700 dark:bg-ink-800 dark:text-cobalt-400 dark:hover:bg-ink-700"
            >
              View all products →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}