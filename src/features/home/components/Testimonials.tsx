import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { testimonials } from '@/mocks/testimonials'

/** Customer quote grid — real-feeling voices, not generic "Lorem ipsum" praise. */
export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="From customers" title="Loved by shoppers across India" className="mb-8" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="surface-card relative p-6"
          >
            <Quote className="absolute right-5 top-5 h-8 w-8 text-porcelain-300 dark:text-ink-700" />
            <Rating value={t.rating} />
            <p className="mt-3 text-sm leading-relaxed text-ink-950 dark:text-porcelain-100">{t.quote}</p>
            <div className="mt-5 flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full" />
              <div>
                <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{t.name}</p>
                <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}