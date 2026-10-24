import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, Settings, LogOut, ShieldCheck } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownPanel, DropdownItem, DropdownLinkItem } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LogoutOverlay } from '@/components/ui/LogoutOverlay'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'

export function UserMenu() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const [loggingOut, setLoggingOut] = useState(false)

  // NAYA: Logout click hote hi overlay dikhाते hain, thodi der (400ms —
  // taaki overlay genuinely dikh sake, turant flash na ho) rukते hain,
  // phir logout() call karके HAMESHA Home-page ('/') pe navigate karte
  // hain — chahe user kisi bhi page pe ho (product-detail, checkout,
  // waghera), logout ke baad hamesha Home pe pahunचना chahiye
  function handleLogout() {
    setLoggingOut(true)
    // FIX: PEHLE navigate karte hain Home-page pe (jab tak user abhi
    // bhi "authenticated" hai — isliye koi route-guard use रोकता nahi).
    // Uske BAAD logout() call karte hain jo auth-state clear karta hai.
    // Agar hum ULTA karte (logout() pehle), to jis PROTECTED-page pe
    // user tha (jaise /account/orders), uska route-guard TURANT
    // "not authenticated" dekh ke /login pe bhej deta — humारे
    // navigate('/') se PEHLE hi, isliye login-page dikhता tha.
    navigate('/', { replace: true })
    window.setTimeout(() => {
      logout()
      toast({ type: 'info', title: 'Signed out', description: 'Come back soon!' })
      setLoggingOut(false)
    }, 400)
  }
  if (!isAuthenticated || !user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link to="/login">
          <Button variant="ghost" size="sm">Log In</Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {loggingOut && <LogoutOverlay />}
      <Dropdown>
        <DropdownTrigger>
          <button aria-label="Account menu" className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-ink-950/[0.05] dark:hover:bg-white/[0.06]">
            <Avatar src={user.avatar} name={user.name} size="sm" />
          </button>
        </DropdownTrigger>
        <DropdownPanel align="end" className="w-56">
          <div className="border-b border-porcelain-300 px-4 py-3 dark:border-ink-700">
            <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{user.name}</p>
            <p className="truncate text-xs text-ink-600 dark:text-porcelain-300/60">{user.email}</p>
          </div>
          <DropdownLinkItem to="/account">
            <User className="h-4 w-4" /> My Account
          </DropdownLinkItem>
          <DropdownLinkItem to="/account/orders">
            <Package className="h-4 w-4" /> Orders
          </DropdownLinkItem>
          <DropdownLinkItem to="/wishlist">
            <Heart className="h-4 w-4" /> Wishlist
          </DropdownLinkItem>
          <DropdownLinkItem to="/account/security">
            <Settings className="h-4 w-4" /> Settings
          </DropdownLinkItem>
          {user.role === 'admin' && (
            <DropdownLinkItem to="/admin">
              <ShieldCheck className="h-4 w-4" /> Admin Dashboard
            </DropdownLinkItem>
          )}
          <div className="my-1 border-t border-porcelain-300 dark:border-ink-700" />
          <DropdownItem onClick={handleLogout}>
            <span className="flex flex-1 items-center gap-2.5 text-danger-500">
              <LogOut className="h-4 w-4" /> Log Out
            </span>
          </DropdownItem>
        </DropdownPanel>
      </Dropdown>
    </>
  )
}