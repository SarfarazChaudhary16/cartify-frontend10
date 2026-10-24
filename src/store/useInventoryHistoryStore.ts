import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface InventoryHistoryEntry {
  id: string
  productId: string
  productTitle: string
  change: number // positive = stock added, negative = stock removed
  previousStock: number
  newStock: number
  reason: string
  timestamp: string
}

interface InventoryHistoryState {
  entries: InventoryHistoryEntry[]
  addEntry: (entry: Omit<InventoryHistoryEntry, 'id' | 'timestamp'>) => void
}

/** Audit log of every manual stock adjustment made from Admin > Inventory. */
export const useInventoryHistoryStore = create<InventoryHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [{ ...entry, id: `inv-${Date.now()}`, timestamp: new Date().toISOString() }, ...state.entries],
        })),
    }),
    { name: 'cartify-inventory-history' },
  ),
)