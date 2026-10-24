import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminMobileSidebar } from '@/features/admin/components/AdminMobileSidebar'
import { AdminTopbar } from '@/features/admin/components/AdminTopbar'
import { TopLoadingBar } from '@/components/ui/TopLoadingBar'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/components/ui/Toast'
import { getAdminPageTitle } from '@/lib/adminNav'

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  const { toast } = useToast()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const isAdmin = isAuthenticated && user?.role === 'admin'

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      toast({ type: 'warning', title: 'Admin access required', description: 'Your account doesn\u2019t have admin permissions.' })
    }
  }, [isAuthenticated, user, toast])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-porcelain-100 dark:bg-ink-950">
      <TopLoadingBar />
      <ScrollToTop />
      <AdminSidebar />
      <AdminMobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title={getAdminPageTitle(location.pathname)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}