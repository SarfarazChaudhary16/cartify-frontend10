import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Mic, Search, TrendingUp, X } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useToast } from '@/components/ui/Toast'
import { useSearchHistoryStore } from '@/store/useSearchHistoryStore'
import { searchProducts, popularSearches } from '@/lib/searchProducts'
import { formatPrice, cn } from '@/lib/utils'

/**
 * Expandable header search: icon on load, grows into a full field with a
 * suggestions dropdown (live matches, recent searches, popular searches).
 * Submitting navigates to /search?q=... (full results grid is Phase 6's page).
 */
export function SearchBar({ className }: { className?: string }) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const history = useSearchHistoryStore((s) => s.queries)
  const addHistory = useSearchHistoryStore((s) => s.add)
  const removeHistory = useSearchHistoryStore((s) => s.remove)

  const suggestions = useMemo(() => (query.trim() ? searchProducts(query).slice(0, 5) : []), [query])

  useClickOutside(containerRef, () => setExpanded(false), expanded)
  useEscapeKey(() => setExpanded(false), expanded)

  function goToResults(q: string) {
    if (!q.trim()) return
    addHistory(q)
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
    setExpanded(false)
    setQuery('')
  }

  function handleVoiceSearch() {
    setListening(true)
    toast({ type: 'info', title: 'Listening…', description: 'Voice search is a UI preview in this build.' })
    window.setTimeout(() => setListening(false), 2200)
  }

  const showDropdown = expanded
  const showEmptyState = query.trim().length === 0

  return (
    <div ref={containerRef} className={cn('relative flex items-center', className)}>
      <motion.div
        initial={false}
        animate={{ width: expanded ? 340 : 44 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'flex h-11 items-center overflow-hidden rounded-xl border',
          expanded
            ? 'border-porcelain-300 bg-white dark:border-ink-700 dark:bg-ink-900'
            : 'border-transparent bg-transparent',
        )}
      >
        <button
          type="button"
          aria-label="Open search"
          onClick={() => {
            setExpanded(true)
            requestAnimationFrame(() => inputRef.current?.focus())
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-950 transition-colors hover:bg-ink-950/[0.05] dark:text-porcelain-100 dark:hover:bg-white/[0.06]"
        >
          <Search className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onSubmit={(e) => {
                e.preventDefault()
                goToResults(query)
              }}
              className="flex flex-1 items-center gap-1 pr-1.5"
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products, brands…"
                className="w-full bg-transparent text-sm text-ink-950 outline-none placeholder:text-ink-600/50 dark:text-porcelain-100 dark:placeholder:text-porcelain-300/40"
              />
              <button
                type="button"
                aria-label="Search by voice"
                onClick={handleVoiceSearch}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                  listening ? 'bg-cobalt-500 text-white' : 'text-ink-600 hover:bg-ink-950/[0.05] dark:text-porcelain-300/60 dark:hover:bg-white/[0.06]',
                )}
              >
                <motion.span animate={listening ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.9, repeat: listening ? Infinity : 0 }}>
                  <Mic className="h-4 w-4" />
                </motion.span>
              </button>
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-950/[0.05] dark:text-porcelain-300/60 dark:hover:bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(380px,90vw)] overflow-hidden rounded-2xl border border-porcelain-300 bg-white shadow-2xl dark:border-ink-700 dark:bg-ink-900"
          >
            {showEmptyState ? (
              <div className="max-h-96 overflow-y-auto p-4">
                {history.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">Recent Searches</p>
                      <button onClick={() => useSearchHistoryStore.getState().clear()} className="text-xs text-cobalt-600 dark:text-cobalt-400">
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {history.map((h) => (
                        <span key={h} className="group flex items-center gap-1.5 rounded-full bg-porcelain-100 py-1.5 pl-3 pr-1.5 text-xs text-ink-700 dark:bg-ink-800 dark:text-porcelain-200">
                          <button onClick={() => goToResults(h)} className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {h}
                          </button>
                          <button onClick={() => removeHistory(h)} aria-label={`Remove ${h}`} className="rounded-full p-0.5 hover:bg-porcelain-300 dark:hover:bg-ink-700">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => goToResults(term)}
                        className="flex items-center gap-1.5 rounded-full bg-cobalt-500/10 px-3 py-1.5 text-xs font-medium text-cobalt-600 dark:text-cobalt-400"
                      >
                        <TrendingUp className="h-3 w-3" /> {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto py-2">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          addHistory(query)
                          navigate(`/product/${p.slug}`)
                          setExpanded(false)
                          setQuery('')
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-porcelain-100 dark:hover:bg-ink-800"
                      >
                        <img src={p.images[0]?.url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{p.title}</p>
                          <p className="price text-xs text-ink-600 dark:text-porcelain-300/60">{formatPrice(p.price)}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => goToResults(query)}
                      className="mt-1 flex w-full items-center gap-2 border-t border-porcelain-300 px-4 py-3 text-sm font-medium text-cobalt-600 dark:border-ink-700 dark:text-cobalt-400"
                    >
                      <Search className="h-3.5 w-3.5" /> Search for &ldquo;{query}&rdquo;
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => goToResults(query)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-cobalt-600 dark:text-cobalt-400"
                  >
                    <Search className="h-3.5 w-3.5" /> Search for &ldquo;{query}&rdquo;
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}