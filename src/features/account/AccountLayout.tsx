import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AccountSidebar } from './components/AccountSidebar'
import { useAuthStore } from '@/store/useAuthStore'

/** Wraps all /account/* routes: guards against unauthenticated access, renders the sidebar shell. */
export default function AccountLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AccountSidebar />
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}