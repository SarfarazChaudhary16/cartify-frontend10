import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAdminAnalyticsStore } from '@/store/useAdminAnalyticsStore'
import { formatPrice } from '@/lib/utils'

export function RevenueChart() {
  const revenueSeries = useAdminAnalyticsStore((s) => s.revenueSeries)

  return (
    <div className="surface-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Revenue — Last 14 Days</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3454FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3454FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-porcelain-300 dark:text-ink-700" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-ink-600 dark:text-porcelain-300/60" axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-ink-600 dark:text-porcelain-300/60"
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
              contentStyle={{ borderRadius: 12, border: '1px solid #e6e1d6', fontSize: 12 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3454FF" strokeWidth={2} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}