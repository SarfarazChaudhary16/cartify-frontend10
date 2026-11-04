import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Bell, Search, CheckCheck, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { NotificationItem } from './components/NotificationItem'
import { useNotificationsStore } from '@/store/useNotificationsStore'
import { notificationCategoryLabel } from '@/lib/notificationMeta'
import type { NotificationCategory } from '@/types'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const PAGE_SIZE = 6

const tabs: { id: NotificationCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: notificationCategoryLabel.orders },
  { id: 'offers', label: notificationCategoryLabel.offers },
  { id: 'wishlist', label: notificationCategoryLabel.wishlist },
  { id: 'system', label: notificationCategoryLabel.system },
  { id: 'account', label: notificationCategoryLabel.account },
]

export default function NotificationsPage() {
  const allNotifications = useNotificationsStore((s) => s.notifications)
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications)
  const markAsRead = useNotificationsStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead)
  const deleteNotification = useNotificationsStore((s) => s.deleteNotification)
  const clearAll = useNotificationsStore((s) => s.clearAll)
  const { toast } = useToast()

  const [tab, setTab] = useState<NotificationCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
  if (isAuthenticated) {
    fetchNotifications().catch(() => {}).finally(() => setLoading(false))
  } else {
    setLoading(false)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated])

  const filtered = useMemo(() => {
    return allNotifications.filter((n) => {
      const matchesTab = tab === 'all' || n.category === tab
      const q = query.trim().toLowerCase()
      const matchesQuery = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [allNotifications, tab, query])

  useEffect(() => setVisibleCount(PAGE_SIZE), [tab, query])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [filtered.length])

  const visible = filtered.slice(0, visibleCount)
  const unreadCount = allNotifications.filter((n) => !n.isRead).length

  async function handleMarkAllRead() {
    try {
      await markAllAsRead()
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    }
  }

  async function handleClearAll() {
    try {
      await clearAll()
      toast({ type: 'info', title: 'All notifications cleared' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed', description: err.response?.data?.message })
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Notifications</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">
            {unreadCount > 0 ? `${unreadCount} unread` : 'You\u2019re all caught up'}
          </p>
        </div>
        {allNotifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />} onClick={handleMarkAllRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={handleClearAll}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                  : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-56">
          <Input placeholder="Search notifications…" value={query} onChange={(e) => setQuery(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      <div className="surface-card mt-6 p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4">
                <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-1/3" />
                  <Skeleton variant="text" className="w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-7 w-7" />}
            title="No notifications"
            description={query || tab !== 'all' ? 'Try a different filter or search term.' : 'New updates about your orders, offers, and account will show up here.'}
          />
        ) : (
          <>
            <AnimatePresence initial={false}>
              {visible.map((n) => (
                <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} onDelete={deleteNotification} />
              ))}
            </AnimatePresence>
            {visibleCount < filtered.length && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                <Skeleton className="h-8 w-8 rounded-full" variant="circle" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}