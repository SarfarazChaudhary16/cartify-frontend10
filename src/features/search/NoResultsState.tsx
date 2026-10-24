import { SearchX } from 'lucide-react'
import { motion } from 'framer-motion'
import { popularSearches } from '@/lib/searchProducts'

export function NoResultsState({ query, onPick }: { query: string; onPick: (term: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/60">
        <SearchX className="h-7 w-7" />
      </span>
      <h3 className="font-display text-xl font-medium text-ink-950 dark:text-porcelain-100">
        No results for &ldquo;{query}&rdquo;
      </h3>
      <p className="max-w-sm text-sm text-ink-600 dark:text-porcelain-300/70">
        Check your spelling, try a more general term, or explore something popular below.
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {popularSearches.map((term) => (
          <button
            key={term}
            onClick={() => onPick(term)}
            className="rounded-full bg-cobalt-500/10 px-3.5 py-1.5 text-xs font-medium text-cobalt-600 dark:text-cobalt-400"
          >
            {term}
          </button>
        ))}
      </div>
    </motion.div>
  )
}