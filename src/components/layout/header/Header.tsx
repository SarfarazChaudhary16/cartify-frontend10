import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Heart, ShoppingBag } from 'lucide-react'
import { Logo } from './Logo'
import { MegaMenu } from './MegaMenu'
import { SearchBar } from './SearchBar'
import { ThemeToggle } from './ThemeToggle'
import { NotificationsMenu } from './NotificationsMenu'
import { UserMenu } from './UserMenu'
import { MobileMenu } from './MobileMenu'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { navLinks } from '@/lib/navigation'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { cn } from '@/lib/utils'
import { CartDrawer } from './CartDrawer'

/** Sticky site header: logo, mega menu, search, and the action cluster (wishlist/cart/notifications/account/theme). */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const cartCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.count())
  const navigate = useNavigate()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-strong shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
            : 'border-b border-transparent bg-porcelain-100 dark:bg-ink-950',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-950 lg:hidden dark:text-porcelain-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="mr-2 shrink-0" />

          <nav className="hidden items-center gap-1 lg:flex">
            <MegaMenu />
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-ink-950/[0.05] dark:text-porcelain-100 dark:hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <SearchBar />

            <Tooltip content="Wishlist">
              <IconButton
                icon={<Heart className="h-5 w-5" />}
                aria-label="Wishlist"
                badge={wishlistCount}
                onClick={() => navigate('/wishlist')}
              />
            </Tooltip>

            <Tooltip content="Cart">
              <IconButton
                icon={<ShoppingBag className="h-5 w-5" />}
                aria-label="Cart"
                badge={cartCount}
                onClick={() => setCartDrawerOpen(true)}
              />
            </Tooltip>

            <NotificationsMenu />
            <ThemeToggle />
            <span className="mx-1 hidden h-6 w-px bg-porcelain-300 dark:bg-ink-700 sm:block" />
            <UserMenu />
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  )
}