import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Order, OrderStatus } from '@/types'

interface BackendTrackingStep {
  status: string
  label: string
  timestamp: string | null
  completed: boolean
}

interface BackendOrderItem {
  id: number
  productId: number
  title: string
  image: string
  price: number
  quantity: number
  color?: string
  size?: string
  lineTotal: number
}

interface BackendOrderAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  phone: string
}

interface BackendOrder {
  id: number
  orderNumber: string
  status: string
  paymentMethod: string
  total: number
  placedAt: string
  address: BackendOrderAddress
  items: BackendOrderItem[]
  trackingSteps: BackendTrackingStep[]
}

// Backend status "PENDING"/"OUT_FOR_DELIVERY" (UPPERCASE) bhejta hai,
// frontend "pending"/"out_for_delivery" (lowercase) expect karta hai —
// simple toLowerCase() se match ho jata hai, kyunki underscores dono
// jagah same hain.
function mapStatus(status: string): OrderStatus {
  return status.toLowerCase() as OrderStatus
}

function mapBackendOrder(o: BackendOrder): Order {
  return {
    id: String(o.id),
    orderNumber: o.orderNumber,
    items: o.items.map((i) => ({
      productId: String(i.productId),
      title: i.title,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
      color: i.color,
      size: i.size,
    })),
    status: mapStatus(o.status),
    total: o.total,
    placedAt: o.placedAt,
    // NOTE: Backend ka OrderAddress SNAPSHOT mein "id"/"label"/"isDefault"
    // fields hote hi nahi (yaad hai — ye jaan-boojh kar ek "frozen copy"
    // hai, saved-Address se link nahi). Frontend ka Address TYPE inhe
    // maangta hai (kyunki wahi type saved-addresses ke liye bhi use hota
    // hai), isliye display-only synthetic values daal rahe hain — inka
    // koi functional use nahi hai, sirf TypeScript ko santust karne ke liye.
    address: {
      id: `order-${o.id}-address`,
      label: 'Shipping Address',
      fullName: o.address.fullName,
      line1: o.address.line1,
      line2: o.address.line2,
      city: o.address.city,
      state: o.address.state,
      pincode: o.address.pincode,
      phone: o.address.phone,
      isDefault: false,
    },
    paymentMethod: o.paymentMethod,
    trackingSteps: o.trackingSteps.map((s) => ({
      status: mapStatus(s.status),
      label: s.label,
      timestamp: s.timestamp ?? '',
      completed: s.completed,
    })),
  }
}

interface OrdersState {
  orders: Order[]
  loading: boolean

  fetchOrders: () => Promise<void>
  getOrder: (id: string) => Order | undefined
  fetchOrder: (id: string) => Promise<Order | undefined>
  placeOrder: (addressId: string, paymentMethod: string, couponCode?: string) => Promise<Order>
  cancelOrder: (id: string, reason: string) => Promise<void>
  requestReturnOrReplace: (id: string, type: 'return' | 'replace', reason: string) => Promise<void>

  // ===== Admin operations (isi store mein reuse karte hain, taaki
  // AdminOrdersPage bhi isi ek store se kaam chala sake) =====
  fetchAllOrdersAdmin: () => Promise<void>
  advanceStatus: (id: string) => Promise<void>
  processRefund: (id: string) => Promise<void>
  resetLocal: () => void  
}

/**
 * Order history — ab REAL backend (/api/orders) se juda hai.
 * placeOrder() customer ke CURRENT CART se, server-side, ek naya Order
 * banata hai (client kabhi bhi price/items decide nahi karta — security
 * ke liye, jaisa backend banate waqt discuss kiya tha).
 */
export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendOrder[]>('/orders')
    set({ orders: response.data.map(mapBackendOrder), loading: false })
  },

  getOrder: (id) => get().orders.find((o) => o.id === id),

  fetchOrder: async (id) => {
    const response = await apiClient.get<BackendOrder>(`/orders/${id}`)
    const mapped = mapBackendOrder(response.data)
    set((state) => {
      const exists = state.orders.some((o) => o.id === mapped.id)
      return { orders: exists ? state.orders.map((o) => (o.id === mapped.id ? mapped : o)) : [mapped, ...state.orders] }
    })
    return mapped
  },

  placeOrder: async (addressId, paymentMethod, couponCode) => {
    const response = await apiClient.post<BackendOrder>('/orders', {
      addressId: Number(addressId),
      paymentMethod,
      // NAYA: agar Cart mein coupon apply kiya tha, uska code bhi
      // bhej dete hain — backend khud verify+apply karega server-side
      couponCode: couponCode || undefined,
    })
    const created = mapBackendOrder(response.data)
    set((state) => ({ orders: [created, ...state.orders] }))
    return created
  },

  cancelOrder: async (id, reason) => {
    const response = await apiClient.put<BackendOrder>(`/orders/${id}/cancel`, { reason })
    const updated = mapBackendOrder(response.data)
    set((state) => ({ orders: state.orders.map((o) => (o.id === id ? updated : o)) }))
  },

  requestReturnOrReplace: async (id, type, reason) => {
    const response = await apiClient.put<BackendOrder>(`/orders/${id}/return`, { type, reason })
    const updated = mapBackendOrder(response.data)
    set((state) => ({ orders: state.orders.map((o) => (o.id === id ? updated : o)) }))
  },

  fetchAllOrdersAdmin: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendOrder[]>('/admin/orders')
    set({ orders: response.data.map(mapBackendOrder), loading: false })
  },

  advanceStatus: async (id) => {
    const response = await apiClient.put<BackendOrder>(`/admin/orders/${id}/advance-status`)
    const updated = mapBackendOrder(response.data)
    set((state) => ({ orders: state.orders.map((o) => (o.id === id ? updated : o)) }))
  },

  processRefund: async (id) => {
    const response = await apiClient.put<BackendOrder>(`/admin/orders/${id}/refund`)
    const updated = mapBackendOrder(response.data)
    set((state) => ({ orders: state.orders.map((o) => (o.id === id ? updated : o)) }))
  },
  resetLocal: () => set({ orders: [] }),
}))