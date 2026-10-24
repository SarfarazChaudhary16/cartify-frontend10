import { Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/shared/SectionHeader'

const posts = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
  'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
]

/** @cartify Instagram feed strip — grid of shoppable-style lifestyle imagery. */
export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="@cartify" title="Tag us in your unboxing" className="mb-6" />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {posts.map((src, i) => (
          <motion.a
            key={src}
            href="#"
            onClick={(e) => e.preventDefault()}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/40">
              <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}