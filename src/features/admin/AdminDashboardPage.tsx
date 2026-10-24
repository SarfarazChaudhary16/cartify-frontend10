import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, ShoppingCart, Users, Package, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from './components/StatCard'
import { RevenueChart } from './components/RevenueChart'
import { OrdersByStatusChart } from './components/OrdersByStatusChart'
import { useAdminAnalyticsStore } from '@/store/useAdminAnalyticsStore'
import { orderStatusVariant, formatOrderStatus } from '@/lib/orderStatus'
import { formatDate, formatPrice } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export default function AdminDashboardPage() {
  const stats = useAdminAnalyticsStore((s) => s.stats)
  const topProducts = useAdminAnalyticsStore((s) => s.topProducts)
  const recentOrders = useAdminAnalyticsStore((s) => s.recentOrders)
  const fetchDashboardData = useAdminAnalyticsStore((s) => s.fetchDashboardData)

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats?.totalRevenue ?? 0)}
          delta={stats?.revenueDelta}
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <StatCard
          label="Total Orders"
          value={(stats?.totalOrders ?? 0).toLocaleString('en-IN')}
          delta={stats?.ordersDelta}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatCard
          label="Total Customers"
          value={(stats?.totalCustomers ?? 0).toLocaleString('en-IN')}
          delta={stats?.customersDelta}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Total Products"
          value={(stats?.totalProducts ?? 0).toLocaleString('en-IN')}
          delta={stats?.productsDelta}
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <RevenueChart />
        <OrdersByStatusChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card">
          <div className="flex items-center justify-between border-b border-porcelain-300 px-5 py-4 dark:border-ink-700">
            <h2 className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Top Selling Products</h2>
            <Link to="/admin/products" className="group flex items-center gap-1 text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
              View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="p-5 text-sm text-ink-600 dark:text-porcelain-300/60">No sales data yet.</p>
          ) : (
            <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
              {topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="price w-5 text-sm font-semibold text-ink-600 dark:text-porcelain-300/50">{i + 1}</span>
                  <img src={p.image} alt={p.title} className="h-11 w-11 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{p.title}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{p.unitsSold} units sold</p>
                  </div>
                  <span className="price shrink-0 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card">
          <div className="flex items-center justify-between border-b border-porcelain-300 px-5 py-4 dark:border-ink-700">
            <h2 className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Recent Orders</h2>
            <Link to="/admin/orders" className="group flex items-center gap-1 text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
              View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-ink-600 dark:text-porcelain-300/60">No orders yet.</p>
          ) : (
            <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">#{order.orderNumber}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{formatDate(order.placedAt)}</p>
                  </div>
                  <Badge variant={orderStatusVariant[order.status as OrderStatus]} className="capitalize">
                    {formatOrderStatus(order.status as OrderStatus)}
                  </Badge>
                  <span className="price shrink-0 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{formatPrice(order.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}