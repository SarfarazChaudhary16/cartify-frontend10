import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAdminAnalyticsStore } from '@/store/useAdminAnalyticsStore'
import { formatOrderStatus } from '@/lib/orderStatus'
import type { OrderStatus } from '@/types'

const COLORS: Record<OrderStatus, string> = {
  pending: '#e0a52c',
  packed: '#3454ff',
  shipped: '#6b82ff',
  out_for_delivery: '#2540e0',
  delivered: '#1f9d63',
  cancelled: '#e5484d',
  returned: '#8b8f99',
  refunded: '#5c6650',
}

export function OrdersByStatusChart() {
  // Backend Map<String, Long> bhejta hai jisme KEY UPPERCASE hoti hai
  // (jaise "PENDING": 5) — yaad hai Java ke groupingBy(o -> o.getStatus().name())
  // se ye aata hai. Frontend ke COLORS/formatOrderStatus lowercase-keys
  // expect karte hain, isliye yahan .toLowerCase() se convert karte hain.
  const ordersByStatus = useAdminAnalyticsStore((s) => s.ordersByStatus)

  const data = Object.entries(ordersByStatus).map(([status, count]) => {
    const lowerStatus = status.toLowerCase() as OrderStatus
    return {
      name: formatOrderStatus(lowerStatus),
      value: count,
      color: COLORS[lowerStatus],
    }
  })

  return (
    <div className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Orders by Status</h2>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-600 dark:text-porcelain-300/60">No orders yet.</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6e1d6', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}