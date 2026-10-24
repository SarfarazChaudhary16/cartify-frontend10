import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { blogPosts, type BlogPost } from '@/mocks/blogPosts'
import { formatDate } from '@/lib/utils'

export default function BlogPage() {
  const [selected, setSelected] = useState<BlogPost | null>(null)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">The Cartify Blog</h1>
      <p className="mt-1.5 text-sm text-ink-600 dark:text-porcelain-300/70">Style guides, behind-the-scenes stories, and shopping tips.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, i) => (
          <motion.button
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setSelected(post)}
            className="surface-card surface-card-lift overflow-hidden text-left"
          >
            <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <Badge variant="cobalt">{post.category}</Badge>
              <p className="mt-2 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{post.title}</p>
              <p className="mt-1.5 line-clamp-2 text-xs text-ink-600 dark:text-porcelain-300/70">{post.excerpt}</p>
              <p className="mt-3 text-xs text-ink-600 dark:text-porcelain-300/50">{post.author} · {formatDate(post.publishedAt)}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && (
          <div>
            <img src={selected.image} alt={selected.title} className="mb-4 h-56 w-full rounded-xl object-cover" />
            <Badge variant="cobalt">{selected.category}</Badge>
            <p className="mt-2 text-xs text-ink-600 dark:text-porcelain-300/50">{selected.author} · {formatDate(selected.publishedAt)}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{selected.content}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}