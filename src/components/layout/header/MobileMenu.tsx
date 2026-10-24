import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, Bell, HelpCircle, LogOut, LogIn, ShieldCheck } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LogoutOverlay } from '@/components/ui/LogoutOverlay'
import { navLinks } from '@/lib/navigation'
import { categories } from '@/mocks/categories'
import { useAuthStore } from '@/store/useAuthStore'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const [loggingOut, setLoggingOut] = useState(false)

  function handleLogout() {
    onClose()
    setLoggingOut(true)
    navigate('/', { replace: true })
    window.setTimeout(() => {
      logout()
      setLoggingOut(false)
    }, 400)
  }

  return (
    <>
      {loggingOut && <LogoutOverlay />}
      <Drawer open={open} onClose={onClose} side="left" title="Menu" widthClassName="max-w-xs">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 rounded-xl bg-porcelain-100 p-3 dark:bg-ink-800">
            <Avatar src={user.avatar} name={user.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{user.name}</p>
              <Link to="/account" onClick={onClose} className="text-xs text-cobalt-600 dark:text-cobalt-400">
                View account
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex gap-2.5">
            <Link to="/login" onClick={onClose} className="flex-1">
              <Button variant="outline" className="w-full" leftIcon={<LogIn className="h-4 w-4" />}>Log In</Button>
            </Link>
            <Link to="/signup" onClick={onClose} className="flex-1">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        )}

        <nav className="mt-5 flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mb-2 mt-6 px-1 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:text-porcelain-300/60">
          Categories
        </p>
        <div className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-sm text-ink-950 transition-colors hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="my-5 border-t border-porcelain-300 dark:border-ink-700" />

        <div className="flex flex-col gap-0.5">
          <Link to="/account/orders" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800">
            <Package className="h-4 w-4" /> Orders
          </Link>
          <Link to="/wishlist" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800">
            <Heart className="h-4 w-4" /> Wishlist
          </Link>
          <Link to="/notifications" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800">
            <Bell className="h-4 w-4" /> Notifications
          </Link>
          <Link to="/help" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800">
            <HelpCircle className="h-4 w-4" /> Help Center
          </Link>
          {isAuthenticated && (
            <Link to="/account" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800">
              <User className="h-4 w-4" /> My Account
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 hover:bg-porcelain-100 dark:text-porcelain-100 dark:hover:bg-ink-800">
              <ShieldCheck className="h-4 w-4" /> Admin Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-danger-500 hover:bg-porcelain-100 dark:hover:bg-ink-800"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          )}
        </div>
      </Drawer>
    </>
  )
}