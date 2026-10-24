import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { categories } from '@/mocks/categories'

/** Grid of shoppable category tiles with an image-zoom hover, just below the hero. */
export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Browse" title="Shop by Category" viewAllHref="/products" className="mb-6" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={`/category/${c.slug}`} className="group relative block aspect-square overflow-hidden rounded-2xl">
              <img
                src={c.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="price text-xs text-white/70">{c.productCount} items</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}