import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { notificationIcon } from '@/lib/notificationMeta'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { AppNotification } from '@/types'

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: AppNotification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const Icon = notificationIcon[notification.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      className={cn(
        'flex cursor-pointer gap-3 rounded-xl p-4 transition-colors',
        notification.isRead ? 'hover:bg-porcelain-100 dark:hover:bg-ink-800' : 'bg-cobalt-500/[0.05] hover:bg-cobalt-500/[0.08]',
      )}
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/70">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{notification.title}</p>
          {!notification.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cobalt-500" />}
        </div>
        <p className="mt-0.5 text-sm text-ink-600 dark:text-porcelain-300/70">{notification.message}</p>
        <p className="mt-1.5 text-xs text-ink-600 dark:text-porcelain-300/50">{formatDate(notification.createdAt)}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(notification.id)
        }}
        aria-label="Delete notification"
        className="h-fit shrink-0 rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-danger-500/10 hover:text-danger-500 dark:text-porcelain-300/50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  )
}