import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedCard {
  id: string
  brand: 'Visa' | 'Mastercard' | 'RuPay' | 'Amex'
  last4: string
  expiry: string
  isDefault?: boolean
}

interface PaymentMethodsState {
  cards: SavedCard[]
  addCard: (card: Omit<SavedCard, 'id'>) => void
  removeCard: (id: string) => void
  setDefault: (id: string) => void
}

/** Saved cards shown in Account > Payment Methods (UI-only — no real card data is ever collected). */
export const usePaymentMethodsStore = create<PaymentMethodsState>()(
  persist(
    (set) => ({
      cards: [
        { id: 'card-1', brand: 'Visa', last4: '4242', expiry: '08/28', isDefault: true },
        { id: 'card-2', brand: 'Mastercard', last4: '8210', expiry: '11/27' },
      ],
      addCard: (card) =>
        set((state) => ({
          cards: card.isDefault
            ? [...state.cards.map((c) => ({ ...c, isDefault: false })), { ...card, id: `card-${Date.now()}` }]
            : [...state.cards, { ...card, id: `card-${Date.now()}` }],
        })),
      removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
      setDefault: (id) => set((state) => ({ cards: state.cards.map((c) => ({ ...c, isDefault: c.id === id })) })),
    }),
    { name: 'cartify-payment-methods' },
  ),
)