import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, ExternalLink } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownPanel, DropdownItem, DropdownLinkItem } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/layout/header/ThemeToggle'
import { LogoutOverlay } from '@/components/ui/LogoutOverlay'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/components/ui/Toast'

export function AdminTopbar({ title, onOpenMobileNav }: { title: string; onOpenMobileNav: () => void }) {
  const navigate = useNavigate()
  const admin = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { toast } = useToast()
  const [loggingOut, setLoggingOut] = useState(false)

 function handleLogout() {
    setLoggingOut(true)
    navigate('/', { replace: true })
    window.setTimeout(() => {
      logout()
      toast({ type: 'info', title: 'Logged out' })
      setLoggingOut(false)
    }, 400)
  }

  return (
    <>
      {loggingOut && <LogoutOverlay />}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-porcelain-300 bg-white px-4 dark:border-ink-700 dark:bg-ink-900 sm:px-6">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-950 lg:hidden dark:text-porcelain-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="truncate font-display text-lg font-medium text-ink-950 dark:text-porcelain-100">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-ink-950/[0.05] dark:hover:bg-white/[0.06]">
                <Avatar name={admin?.name ?? 'Admin'} size="sm" />
                <span className="hidden text-sm font-medium text-ink-950 dark:text-porcelain-100 sm:block">{admin?.name}</span>
              </button>
            </DropdownTrigger>
            <DropdownPanel align="end" className="w-52">
              <div className="border-b border-porcelain-300 px-4 py-3 dark:border-ink-700">
                <p className="truncate text-sm font-medium text-ink-950 dark:text-porcelain-100">{admin?.name}</p>
                <p className="truncate text-xs text-ink-600 dark:text-porcelain-300/60">Administrator</p>
              </div>
              <DropdownLinkItem to="/">
                <ExternalLink className="h-4 w-4" /> View Storefront
              </DropdownLinkItem>
              <div className="my-1 border-t border-porcelain-300 dark:border-ink-700" />
              <DropdownItem onClick={handleLogout}>
                <span className="flex flex-1 items-center gap-2.5 text-danger-500">
                  <LogOut className="h-4 w-4" /> Log Out
                </span>
              </DropdownItem>
            </DropdownPanel>
          </Dropdown>
        </div>
      </header>
    </>
  )
}