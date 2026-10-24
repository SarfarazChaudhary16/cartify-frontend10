export interface RevenuePoint {
  date: string
  revenue: number
}

/** 14 days of mock daily revenue, trending upward with realistic day-to-day noise. */
export const revenueSeries: RevenuePoint[] = (() => {
  const base = 42000
  const points: RevenuePoint[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const trend = (13 - i) * 1400
    const noise = Math.sin(i * 1.3) * 6000 + (i % 3 === 0 ? 4000 : 0)
    points.push({ date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), revenue: Math.round(base + trend + noise) })
  }
  return points
})()

export interface TopProduct {
  id: string
  title: string
  image: string
  unitsSold: number
  revenue: number
}

export const topProducts: TopProduct[] = [
  { id: 'p-001', title: 'Northline Strider Runner', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', unitsSold: 342, revenue: 2222658 },
  { id: 'p-004', title: 'Verve Aria ANC Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', unitsSold: 289, revenue: 2600711 },
  { id: 'p-009', title: 'Verve Pulse True Wireless Earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200', unitsSold: 264, revenue: 1055736 },
  { id: 'p-003', title: 'Fieldstone Atlas 28L Backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', unitsSold: 198, revenue: 653202 },
  { id: 'p-010', title: 'Loom & Co. Drift Fleece Hoodie', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200', unitsSold: 176, revenue: 387024 },
]

export interface DashboardStat {
  label: string
  value: string
  delta: number
}

export const dashboardTrends: Record<'revenue' | 'orders' | 'customers' | 'products', number> = {
  revenue: 12.4,
  orders: 8.1,
  customers: 5.6,
  products: 2.3,
}

export interface CategorySales {
  category: string
  revenue: number
}

export const salesByCategory: CategorySales[] = [
  { category: 'Sneakers & Footwear', revenue: 3222658 },
  { category: 'Audio', revenue: 3656447 },
  { category: 'Bags & Backpacks', revenue: 1653202 },
  { category: 'Apparel', revenue: 987024 },
  { category: 'Watches', revenue: 812441 },
  { category: 'Eyewear', revenue: 356210 },
]