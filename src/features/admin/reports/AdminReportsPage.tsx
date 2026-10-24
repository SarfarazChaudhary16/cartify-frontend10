import { useEffect, useState } from 'react'
import { Download, IndianRupee, ShoppingBag, Package, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/features/admin/components/StatCard'
import { RevenueChart } from '@/features/admin/components/RevenueChart'
import { OrdersByStatusChart } from '@/features/admin/components/OrdersByStatusChart'
import { SalesByCategoryChart } from './components/SalesByCategoryChart'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useAdminUsersStore } from '@/store/useAdminUsersStore'
import { useAdminAnalyticsStore } from '@/store/useAdminAnalyticsStore'
import { useAdminReportsStore } from '@/store/useAdminReportsStore'
import { apiClient } from '@/lib/apiClient'
import { downloadCsv } from '@/lib/exportCsv'
import { formatPrice, formatDate, cn } from '@/lib/utils'

type Tab = 'revenue' | 'sales' | 'products' | 'customers'

const tabs: { id: Tab; label: string }[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'sales', label: 'Sales' },
  { id: 'products', label: 'Products' },
  { id: 'customers', label: 'Customers' },
]

// Products tab ke liye "top 10" alag se fetch karte hain (Dashboard
// wala sirf top-5 leta hai, Reports mein zyada detail chahiye)
interface TopProductRow {
  productId: number
  title: string
  image: string
  unitsSold: number
  revenue: number
}

export default function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>('revenue')
  const orders = useOrdersStore((s) => s.orders)
  const fetchAllOrdersAdmin = useOrdersStore((s) => s.fetchAllOrdersAdmin)
  const users = useAdminUsersStore((s) => s.users)
  const fetchUsers = useAdminUsersStore((s) => s.fetchUsers)
  const revenueSeries = useAdminAnalyticsStore((s) => s.revenueSeries)
  const fetchDashboardData = useAdminAnalyticsStore((s) => s.fetchDashboardData)
  const salesByCategory = useAdminReportsStore((s) => s.salesByCategory)
  const fetchSalesByCategory = useAdminReportsStore((s) => s.fetchSalesByCategory)

  const [topProducts, setTopProducts] = useState<TopProductRow[]>([])

  useEffect(() => {
    if (orders.length === 0) fetchAllOrdersAdmin()
    if (users.length === 0) fetchUsers()
    if (revenueSeries.length === 0) fetchDashboardData()
    if (salesByCategory.length === 0) fetchSalesByCategory()
    apiClient.get<TopProductRow[]>('/admin/analytics/top-products?limit=10').then((res) => setTopProducts(res.data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const activeCustomers = users.filter((u) => u.status === 'active').length
  const topCustomers = [...users].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 8)

  function exportRevenue() {
    downloadCsv('cartify-revenue-report', ['Date', 'Revenue (INR)'], revenueSeries.map((r) => [r.date, r.revenue]))
  }
  function exportSales() {
    downloadCsv(
      'cartify-sales-report',
      ['Order Number', 'Status', 'Date', 'Total (INR)'],
      orders.map((o) => [o.orderNumber, o.status, formatDate(o.placedAt), o.total]),
    )
  }
  function exportProducts() {
    downloadCsv('cartify-product-sales-report', ['Product', 'Units Sold', 'Revenue (INR)'], topProducts.map((p) => [p.title, p.unitsSold, p.revenue]))
  }
  function exportCustomers() {
    downloadCsv(
      'cartify-customers-report',
      ['Name', 'Email', 'Joined', 'Orders', 'Total Spent (INR)', 'Status'],
      users.map((u) => [u.name, u.email, formatDate(u.joinedAt), u.ordersCount, u.totalSpent, u.status]),
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Export any report as a CSV file.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                  : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'revenue' && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={<IndianRupee className="h-5 w-5" />} />
            <StatCard label="Average Order Value" value={formatPrice(avgOrderValue)} icon={<ShoppingBag className="h-5 w-5" />} />
            <StatCard label="Total Orders" value={orders.length.toLocaleString('en-IN')} icon={<Package className="h-5 w-5" />} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={exportRevenue}>Export CSV</Button>
          </div>
          <div className="mt-3">
            <RevenueChart />
          </div>
        </div>
      )}

      {tab === 'sales' && (
        <div className="mt-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={exportSales}>Export CSV</Button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <OrdersByStatusChart />
            <SalesByCategoryChart />
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={exportProducts}>Export CSV</Button>
          </div>
          <div className="surface-card mt-3 overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-porcelain-300 text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Units Sold</th>
                  <th className="px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
                {topProducts.map((p) => (
                  <tr key={p.productId}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                        <span className="font-medium text-ink-950 dark:text-porcelain-100">{p.title}</span>
                      </div>
                    </td>
                    <td className="price px-4 py-3 text-ink-950 dark:text-porcelain-100">{p.unitsSold}</td>
                    <td className="price px-4 py-3 font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-600 dark:text-porcelain-300/50">
            {salesByCategory.length} categories tracked · see the Sales tab for the category breakdown chart.
          </p>
        </div>
      )}

      {tab === 'customers' && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Customers" value={users.length.toString()} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Active Customers" value={activeCustomers.toString()} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Blocked Customers" value={(users.length - activeCustomers).toString()} icon={<Users className="h-5 w-5" />} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={exportCustomers}>Export CSV</Button>
          </div>
          <div className="surface-card mt-3 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-porcelain-300 text-left text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-porcelain-300 dark:divide-ink-700">
                {topCustomers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-950 dark:text-porcelain-100">{u.name}</p>
                      <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{u.email}</p>
                    </td>
                    <td className="price px-4 py-3 text-ink-950 dark:text-porcelain-100">{u.ordersCount}</td>
                    <td className="price px-4 py-3 font-medium text-ink-950 dark:text-porcelain-100">{formatPrice(u.totalSpent)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'} className="capitalize">{u.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}