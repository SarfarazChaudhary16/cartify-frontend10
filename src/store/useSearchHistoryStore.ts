import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_HISTORY = 8

interface SearchHistoryState {
  queries: string[]
  add: (query: string) => void
  remove: (query: string) => void
  clear: () => void
}

/** Recent search terms, shown in the header search dropdown before/while typing. */
export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      queries: ['running shoes', 'wireless earbuds'],
      add: (query) => {
        const q = query.trim()
        if (!q) return
        const existing = get().queries.filter((item) => item.toLowerCase() !== q.toLowerCase())
        set({ queries: [q, ...existing].slice(0, MAX_HISTORY) })
      },
      remove: (query) => set((state) => ({ queries: state.queries.filter((q) => q !== query) })),
      clear: () => set({ queries: [] }),
    }),
    { name: 'cartify-search-history' },
  ),
)