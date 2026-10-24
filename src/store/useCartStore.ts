import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { CartItem } from '@/types'

const FREE_SHIPPING_THRESHOLD = 999
const FLAT_SHIPPING_FEE = 49

interface BackendCartItem {
  id: number
  productId: number
  title: string
  image: string
  price: number
  availableStock: number
  quantity: number
  color?: string
  size?: string
  lineTotal: number
}

function mapBackendCartItem(item: BackendCartItem): CartItem {
  return {
    id: String(item.id),
    productId: String(item.productId),
    title: item.title,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
  }
}

// Coupon backend mein "store" nahi hota (jaisa mock mein tha) — sirf
// ek /validate endpoint hai jo current subtotal ke against check karta
// hai aur discount-amount batata hai. Isliye applied-coupon ki state
// hum sirf FRONTEND mein rakhte hain (session ke liye) — order-place
// karte waqt abhi coupon backend tak nahi jaata (Checkout API abhi
// isse support nahi karta, ye future improvement hai).
interface AppliedCoupon {
  code: string
  discountAmount: number
}

interface CartState {
  items: CartItem[]
  loading: boolean
  appliedCoupon: AppliedCoupon | null

  fetchCart: () => Promise<void>
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clear: () => Promise<void>

  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>
  removeCoupon: () => void

  resetLocal: () => void

  itemCount: () => number
  subtotal: () => number
  couponDiscount: () => number
  shippingFee: () => number
  total: () => number
}

/**
 * Cart ab REAL backend (/api/cart) se juda hai. NOTE: "Gift Cards" aur
 * "Save for Later" features poori tarah HATA di gayi hain — backend
 * inhe support nahi karta, aur fake/decorative features rakhna
 * misleading hota (jaisa pehle discuss kiya).
 */
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  appliedCoupon: null,

  fetchCart: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendCartItem[]>('/cart')
    set({ items: response.data.map(mapBackendCartItem), loading: false })
  },

  addItem: async (item, quantity = 1) => {
    // NOTE: item.id/title/image/price (jo purane call-sites bhejte hain)
    // yahan IGNORE hote hain — backend ye saari details KHUD product
    // se nikalta hai (live price/title/image), humein sirf productId +
    // color + size bhejni hoti hai
    const response = await apiClient.post<BackendCartItem>('/cart', {
      productId: Number(item.productId),
      quantity,
      color: item.color,
      size: item.size,
    })
    const updated = mapBackendCartItem(response.data)

    set((state) => {
      // Backend agar EXISTING item (same product+color+size) mila,
      // to WAHI ID wapas bhejta hai (merged quantity ke saath) — isliye
      // hum check karte hain: "kya ye ID already local list mein hai?"
      // Agar haan -> REPLACE karo. Agar nahi -> naya item PUSH karo.
      const alreadyExists = state.items.some((i) => i.id === updated.id)
      return {
        items: alreadyExists
          ? state.items.map((i) => (i.id === updated.id ? updated : i))
          : [...state.items, updated],
      }
    })
  },

  removeItem: async (id) => {
    await apiClient.delete(`/cart/${id}`)
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
  },

  updateQuantity: async (id, quantity) => {
    const safeQuantity = Math.max(1, quantity)
    const response = await apiClient.put<BackendCartItem>(`/cart/${id}?quantity=${safeQuantity}`)
    const updated = mapBackendCartItem(response.data)
    set((state) => ({ items: state.items.map((i) => (i.id === id ? updated : i)) }))
  },

  clear: async () => {
    await apiClient.delete('/cart')
    set({ items: [], appliedCoupon: null })
  },

  applyCoupon: async (code) => {
    try {
      const response = await apiClient.get('/coupons/validate', {
        params: { code, orderTotal: get().subtotal() },
      })
      const { valid, message, discountAmount } = response.data

      if (!valid) {
        set({ appliedCoupon: null })
        return { success: false, message }
      }

      set({ appliedCoupon: { code: code.toUpperCase(), discountAmount } })
      return { success: true, message }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message ?? 'Failed to validate coupon.' }
    }
  },

  removeCoupon: () => set({ appliedCoupon: null }),
  resetLocal: () => set({ items: [], appliedCoupon: null }),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  couponDiscount: () => get().appliedCoupon?.discountAmount ?? 0,

  // Shipping abhi bhi CLIENT-SIDE simulate hota hai — backend Order-total
  // mein shipping-fee ka koi calculation nahi karta abhi (future improvement)
  shippingFee: () => {
    const netAfterDiscount = get().subtotal() - get().couponDiscount()
    return netAfterDiscount >= FREE_SHIPPING_THRESHOLD || netAfterDiscount <= 0 ? 0 : FLAT_SHIPPING_FEE
  },

  total: () => Math.max(0, get().subtotal() - get().couponDiscount()) + get().shippingFee(),
}))