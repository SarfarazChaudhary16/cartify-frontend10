import {
  LayoutDashboard, Package, FolderTree, Tags, ShoppingCart, Boxes, Users, Ticket, Star, BarChart3, Settings, LifeBuoy,
} from 'lucide-react'

export const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/brands', label: 'Brands', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/support-tickets', label: 'Support Tickets', icon: LifeBuoy },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

/** Best-match page title for the admin topbar, based on the current pathname. */
export function getAdminPageTitle(pathname: string): string {
  const sorted = [...adminNavItems].sort((a, b) => b.to.length - a.to.length)
  const match = sorted.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))
  return match?.label ?? 'Admin'
}