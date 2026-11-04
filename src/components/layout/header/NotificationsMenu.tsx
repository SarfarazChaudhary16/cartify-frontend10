import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownPanel } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { useNotificationsStore } from '@/store/useNotificationsStore'
import { notificationIcon } from '@/lib/notificationMeta'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

export function NotificationsMenu() {
  const notifications = useNotificationsStore((s) => s.notifications)
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications)
  const markAsRead = useNotificationsStore((s) => s.markAsRead)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
  if (isAuthenticated) fetchNotifications().catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated])

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const preview = notifications.slice(0, 4)

  return (
    <Dropdown>
      <DropdownTrigger>
        <IconButton icon={<Bell className="h-5 w-5" />} aria-label="Notifications" badge={unreadCount} />
      </DropdownTrigger>
      <DropdownPanel className="w-80 !py-0" align="end">
        <div className="border-b border-porcelain-300 px-4 py-3 dark:border-ink-700">
          <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Notifications</p>
        </div>
        <div className="max-h-80 overflow-y-auto py-1.5">
          {preview.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-600 dark:text-porcelain-300/60">You're all caught up.</p>
          ) : (
            preview.map((n) => {
              const Icon = notificationIcon[n.category]
              return (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn('flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-porcelain-100 dark:hover:bg-ink-800', !n.isRead && 'bg-cobalt-500/[0.04]')}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/70">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-600 dark:text-porcelain-300/60">{n.message}</p>
                  </div>
                  {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cobalt-500" />}
                </button>
              )
            })
          )}
        </div>
        <Link
          to="/notifications"
          className="block border-t border-porcelain-300 px-4 py-3 text-center text-sm font-medium text-cobalt-600 transition-colors hover:bg-porcelain-100 dark:border-ink-700 dark:text-cobalt-400 dark:hover:bg-ink-800"
        >
          View all notifications
        </Link>
      </DropdownPanel>
    </Dropdown>
  )
}