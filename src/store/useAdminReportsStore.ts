import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

interface CategorySales {
  category: string
  revenue: number
  unitsSold: number
}

interface BackendCategorySales {
  categoryName: string
  revenue: number
  unitsSold: number
}

interface AdminReportsState {
  salesByCategory: CategorySales[]
  fetchSalesByCategory: () => Promise<void>
}

/**
 * Reports page ke liye ek chhota-dedicated store — sirf "Sales by
 * Category" data yahan hai (baaki sab Revenue/Orders/Customers,
 * useOrdersStore/useAdminUsersStore/useAdminAnalyticsStore se already
 * mil jata hai, koi duplicate-store banane ki zarurat nahi).
 */
export const useAdminReportsStore = create<AdminReportsState>((set) => ({
  salesByCategory: [],

  fetchSalesByCategory: async () => {
    const response = await apiClient.get<BackendCategorySales[]>('/admin/analytics/sales-by-category')
    set({
      salesByCategory: response.data.map((c) => ({
        category: c.categoryName,
        revenue: c.revenue,
        unitsSold: c.unitsSold,
      })),
    })
  },
}))