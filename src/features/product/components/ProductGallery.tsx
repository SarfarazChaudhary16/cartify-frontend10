import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCw, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/types'

type Tab = 'photos' | '360' | 'video'

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [tab, setTab] = useState<Tab>('photos')

  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        {(['photos', '360', 'video'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              tab === t
                ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
            )}
          >
            {t === 'photos' && 'Photos'}
            {t === '360' && (
              <>
                <RotateCw className="h-3.5 w-3.5" /> 360°
              </>
            )}
            {t === 'video' && (
              <>
                <Play className="h-3.5 w-3.5" /> Video
              </>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'photos' && (
          <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-porcelain-200 dark:bg-ink-800">
              <img
                src={images[activeIndex]?.url}
                alt={images[activeIndex]?.alt ?? title}
                className="h-full w-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2.5">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                      i === activeIndex ? 'border-cobalt-500' : 'border-transparent',
                    )}
                  >
                    <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === '360' && (
          <motion.div
            key="360"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/60"
          >
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <RotateCw className="h-10 w-10" />
            </motion.span>
            <p className="text-sm font-medium">360° view coming soon</p>
          </motion.div>
        )}

        {tab === 'video' && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl bg-ink-950 text-porcelain-100"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            </span>
            <p className="text-sm font-medium text-porcelain-300/70">Product video coming soon</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}