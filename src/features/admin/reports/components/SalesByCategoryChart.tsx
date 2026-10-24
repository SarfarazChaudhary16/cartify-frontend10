import { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { useAdminReportsStore } from '@/store/useAdminReportsStore'
import { formatPrice } from '@/lib/utils'

const BAR_COLORS = ['#3454FF', '#6b82ff', '#c9a24b', '#1f9d63', '#e0a52c', '#8b8f99']

export function SalesByCategoryChart() {
  const salesByCategory = useAdminReportsStore((s) => s.salesByCategory)
  const fetchSalesByCategory = useAdminReportsStore((s) => s.fetchSalesByCategory)

  useEffect(() => {
    if (salesByCategory.length === 0) fetchSalesByCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Sales by Category</h2>
      {salesByCategory.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-600 dark:text-porcelain-300/60">No sales data yet.</p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByCategory} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-porcelain-300 dark:text-ink-700" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-ink-600 dark:text-porcelain-300/60" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" width={140} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-ink-600 dark:text-porcelain-300/60" axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [formatPrice(Number(value)), 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #e6e1d6', fontSize: 12 }} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {salesByCategory.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}