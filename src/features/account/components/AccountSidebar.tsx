import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, MapPin, Package, Heart, Bell, ShieldCheck, HelpCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/reviews', label: 'My Reviews', icon: Star },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
  // NAYA: Help Center link — /account se seedha Help Center (jahan
  // Raise-Ticket aur FAQs dono milte hain) tak pahunchne ke liye
  { to: '/help', label: 'Help Center', icon: HelpCircle },
  { to: '/account/security', label: 'Security', icon: ShieldCheck },
]

export function AccountSidebar() {
  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                : 'text-ink-700 hover:bg-porcelain-100 dark:text-porcelain-200 dark:hover:bg-ink-800',
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}