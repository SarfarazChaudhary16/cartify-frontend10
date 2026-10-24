import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

interface DashboardStats {
  totalRevenue: number
  revenueDelta: number
  totalOrders: number
  ordersDelta: number
  totalCustomers: number
  customersDelta: number
  totalProducts: number
  productsDelta: number
}

interface RevenuePoint {
  date: string
  revenue: number
}

interface TopProduct {
  productId: number
  title: string
  image: string
  unitsSold: number
  revenue: number
}

// Recent-orders ke liye sirf itni fields chahiye jitni Dashboard card
// mein dikhani hain — poori OrderResponse-mapping (jo useOrdersStore mein
// hai) yahan repeat karne ki zarurat nahi, chhoti/simple shape kaafi hai
interface RecentOrder {
  id: string
  orderNumber: string
  status: string // lowercase, jaise "pending" — formatOrderStatus() ko yahi chahiye
  total: number
  placedAt: string
}

interface AdminAnalyticsState {
  stats: DashboardStats | null
  revenueSeries: RevenuePoint[]
  ordersByStatus: Record<string, number>
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
  loading: boolean

  fetchDashboardData: () => Promise<void>
}

/**
 * Admin Dashboard ke saare analytics-widgets ek hi store se manage karte
 * hain — page load hote hi 5 endpoints EK SAATH (Promise.all se parallel)
 * call karte hain, taaki poora Dashboard jaldi render ho.
 */
export const useAdminAnalyticsStore = create<AdminAnalyticsState>((set) => ({
  stats: null,
  revenueSeries: [],
  ordersByStatus: {},
  topProducts: [],
  recentOrders: [],
  loading: false,

  fetchDashboardData: async () => {
    set({ loading: true })

    // Promise.all — saare 5 API calls EK SAATH (parallel) bhejte hain,
    // na ki ek-ek karke (sequential) — isse Dashboard MUCH faster load hota hai
    const [statsRes, revenueRes, statusRes, topProductsRes, recentOrdersRes] = await Promise.all([
      apiClient.get<DashboardStats>('/admin/analytics/dashboard-stats'),
      apiClient.get<RevenuePoint[]>('/admin/analytics/revenue-series'),
      apiClient.get<Record<string, number>>('/admin/analytics/orders-by-status'),
      apiClient.get<TopProduct[]>('/admin/analytics/top-products?limit=5'),
      apiClient.get<any[]>('/admin/analytics/recent-orders?limit=5'),
    ])

    set({
      stats: statsRes.data,
      revenueSeries: revenueRes.data,
      ordersByStatus: statusRes.data,
      topProducts: topProductsRes.data,
      recentOrders: recentOrdersRes.data.map((o) => ({
        id: String(o.id),
        orderNumber: o.orderNumber,
        status: o.status.toLowerCase(),
        total: o.total,
        placedAt: o.placedAt,
      })),
      loading: false,
    })
  },
}))