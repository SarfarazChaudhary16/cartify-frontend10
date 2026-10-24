import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { AppNotification, NotificationCategory } from '@/types'

interface BackendNotification {
  id: number
  category: string // "ORDERS" | "OFFERS" | "WISHLIST" | "SYSTEM" | "ACCOUNT" (uppercase enum)
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

function mapBackendNotification(n: BackendNotification): AppNotification {
  return {
    id: String(n.id),
    // Backend enum UPPERCASE mein hai ("ORDERS"), frontend lowercase
    // expect karta hai ("orders") — .toLowerCase() se convert kar rahe hain
    category: n.category.toLowerCase() as NotificationCategory,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt,
  }
}

interface NotificationsState {
  notifications: AppNotification[]
  loading: boolean

  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAll: () => Promise<void>
  resetLocal: () => void
}

/**
 * Notification Center — ab REAL backend (/api/notifications) se juda hai.
 * NOTE: "addNotification"/"Simulate new" poori tarah HATA diya gaya —
 * backend mein koi user-facing "create notification" endpoint hai hi
 * nahi (notifications sirf internally OrderService jaisi jagah se
 * banti hain, jab wo wiring future mein ho). Fake/simulated notifications
 * dikhana ab misleading hota, isliye hata diya.
 */
export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendNotification[]>('/notifications')
    set({ notifications: response.data.map(mapBackendNotification), loading: false })
  },

  markAsRead: async (id) => {
    const response = await apiClient.put<BackendNotification>(`/notifications/${id}/read`)
    const updated = mapBackendNotification(response.data)
    set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? updated : n)) }))
  },

  markAllAsRead: async () => {
    await apiClient.put('/notifications/mark-all-read')
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, isRead: true })) }))
  },

  deleteNotification: async (id) => {
    await apiClient.delete(`/notifications/${id}`)
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }))
  },

  clearAll: async () => {
    await apiClient.delete('/notifications')
    set({ notifications: [] })
  },
  resetLocal: () => set({ notifications: [] }),
}))