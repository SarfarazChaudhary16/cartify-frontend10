import { useState } from 'react'
import { motion } from 'framer-motion'
import { Accordion } from '@/components/shared/Accordion'
import { ReviewsSection } from './ReviewsSection'
import { productFaqs } from '@/mocks/faqs'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

type Tab = 'description' | 'specifications' | 'reviews' | 'faqs'

const tabs: { id: Tab; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faqs', label: 'FAQs' },
]

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>('description')

  return (
    <div>
      <div className="flex gap-6 border-b border-porcelain-300 dark:border-ink-700">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative py-3 text-sm font-medium text-ink-600 transition-colors dark:text-porcelain-300/60"
          >
            <span className={cn(tab === t.id && 'text-ink-950 dark:text-porcelain-100')}>
              {t.label}
              {t.id === 'reviews' && ` (${product.reviewCount})`}
            </span>
            {tab === t.id && (
              <motion.span layoutId="product-tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-cobalt-500" />
            )}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === 'description' && (
          <div className="max-w-3xl text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">
            <p>{product.description}</p>
            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-porcelain-200 px-3 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-porcelain-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'specifications' && (
          <div className="max-w-2xl divide-y divide-porcelain-300 dark:divide-ink-700">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-4 py-3 text-sm">
                <span className="text-ink-600 dark:text-porcelain-300/60">{spec.label}</span>
                <span className="font-medium text-ink-950 dark:text-porcelain-100">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && <ReviewsSection product={product} />}

        {tab === 'faqs' && <Accordion items={productFaqs} className="max-w-2xl" />}
      </div>
    </div>
  )
}