import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Slide {
  id: string
  eyebrow: string
  title: string
  description: string
  cta: { label: string; href: string }
  image: string
}

const slides: Slide[] = [
  {
    id: 's-1',
    eyebrow: 'New Season',
    title: 'Built for the mile you haven\u2019t run yet',
    description: 'Performance footwear and gear engineered for daily wear, not just launch day.',
    cta: { label: 'Shop Footwear', href: '/category/sneakers-footwear' },
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600',
  },
  {
    id: 's-2',
    eyebrow: 'Flash Sale',
    title: 'Up to 40% off, for the next few hours only',
    description: 'Audio, watches, and footwear at their lowest prices this season.',
    cta: { label: 'Shop the Sale', href: '/products?filter=flash-sale' },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600',
  },
  {
    id: 's-3',
    eyebrow: 'Just Landed',
    title: 'The Monsoon Edit is here',
    description: 'Fresh apparel drops from Loom & Co., cut for everyday wear.',
    cta: { label: 'Shop New Arrivals', href: '/products?filter=new' },
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600',
  },
]

/** Auto-advancing hero carousel, pauses on hover, with manual dot navigation. */
export function HeroBanner() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500)
    return () => clearInterval(id)
  }, [paused])

  const slide = slides[index]

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-ink-950"
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-ink-950/10" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-gold-400">{slide.eyebrow}</p>
            <h1 className="font-display text-4xl font-medium leading-[1.1] text-porcelain-100 sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-4 text-base text-porcelain-300/80 sm:text-lg">{slide.description}</p>
            <div className="mt-8">
              <Link to={slide.cta.href}>
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {slide.cta.label}
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/20"
            >
              {i === index && (
                <motion.span
                  key={`${s.id}-${paused}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-white"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: paused ? 20 : 5.5, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}