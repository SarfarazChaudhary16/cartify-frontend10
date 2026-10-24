import { Link, useNavigate } from 'react-router-dom'
import { Package, Heart, MapPin, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/useAuthStore'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useAddressesStore } from '@/store/useAddressesStore'
import { getProductById } from '@/mocks/products'
import { formatDate, formatPrice } from '@/lib/utils'
import { orderStatusVariant, formatOrderStatus } from '@/lib/orderStatus'

export default function AccountDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const orders = useOrdersStore((s) => s.orders)
  const wishlistCount = useWishlistStore((s) => s.count())
  const addresses = useAddressesStore((s) => s.addresses)
  const recentOrders = orders.slice(0, 3)
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">
        Welcome back, {user?.name.split(' ')[0]}
      </h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Here's what's happening with your account.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/account/orders" className="surface-card surface-card-lift flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-500">
            <Package className="h-5 w-5" />
          </span>
          <div>
            <p className="price text-xl font-semibold text-ink-950 dark:text-porcelain-100">{orders.length}</p>
            <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Orders</p>
          </div>
        </Link>
        <Link to="/wishlist" className="surface-card surface-card-lift flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-500/10 text-danger-500">
            <Heart className="h-5 w-5" />
          </span>
          <div>
            <p className="price text-xl font-semibold text-ink-950 dark:text-porcelain-100">{wishlistCount}</p>
            <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Wishlist Items</p>
          </div>
        </Link>
        <Link to="/account/addresses" className="surface-card surface-card-lift flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="price text-xl font-semibold text-ink-950 dark:text-porcelain-100">{addresses.length}</p>
            <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Saved Addresses</p>
          </div>
        </Link>
      </div>

      <div className="surface-card mt-6">
        <div className="flex items-center justify-between border-b border-porcelain-300 px-5 py-4 dark:border-ink-700">
          <h2 className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Recent Orders</h2>
          <Link to="/account/orders" className="group flex items-center gap-1 text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
            View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-5 text-sm text-ink-600 dark:text-porcelain-300/60">No orders yet.</p>
        ) : (
          <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
            {recentOrders.map((order) => {
              const firstProduct = getProductById(order.items[0]?.productId ?? '')
              const thumb = <img src={order.items[0]?.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/account/orders/${order.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/account/orders/${order.id}`)}
                  className="flex cursor-pointer items-center gap-4 p-5 transition-colors hover:bg-porcelain-100 dark:hover:bg-ink-800"
                >
                  {firstProduct ? (
                    <Link to={`/product/${firstProduct.slug}`} onClick={(e) => e.stopPropagation()} aria-label={`View ${order.items[0]?.title}`}>
                      {thumb}
                    </Link>
                  ) : (
                    thumb
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">
                      {order.items[0]?.title}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                    </p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">
                      #{order.orderNumber} · {formatDate(order.placedAt)}
                    </p>
                  </div>
                  <Badge variant={orderStatusVariant[order.status]} className="capitalize">
                    {formatOrderStatus(order.status)}
                  </Badge>
                  <span className="price hidden text-sm font-semibold text-ink-950 dark:text-porcelain-100 sm:block">
                    {formatPrice(order.total)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}