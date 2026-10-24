import { ShoppingBag, Tag, Heart, Info, Settings } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { useNotificationPrefsStore } from '@/store/useNotificationPrefsStore'
import type { NotificationCategory } from '@/types'

const categories: { id: NotificationCategory; label: string; description: string; icon: typeof ShoppingBag }[] = [
  { id: 'orders', label: 'Orders', description: 'Shipping updates, delivery confirmations', icon: ShoppingBag },
  { id: 'offers', label: 'Offers', description: 'Flash sales, coupons, price drops', icon: Tag },
  { id: 'wishlist', label: 'Wishlist', description: 'Price changes on saved items', icon: Heart },
  { id: 'system', label: 'System', description: 'New arrivals, app updates', icon: Info },
  { id: 'account', label: 'Account', description: 'Security alerts, payment confirmations', icon: Settings },
]

export default function NotificationSettingsPage() {
  const prefs = useNotificationPrefsStore((s) => s.prefs)
  const toggle = useNotificationPrefsStore((s) => s.toggle)

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Notification Settings</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Choose what you hear from us, and how.</p>

      <div className="surface-card mt-6">
        <div className="grid grid-cols-[1fr_80px_80px] items-center gap-4 border-b border-porcelain-300 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-600 dark:border-ink-700 dark:text-porcelain-300/60">
          <span>Category</span>
          <span className="text-center">Email</span>
          <span className="text-center">Push</span>
        </div>
        <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
          {categories.map((cat) => (
            <div key={cat.id} className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/70">
                  <cat.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{cat.label}</p>
                  <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{cat.description}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Switch checked={prefs[cat.id].email} onChange={() => toggle(cat.id, 'email')} aria-label={`${cat.label} email notifications`} />
              </div>
              <div className="flex justify-center">
                <Switch checked={prefs[cat.id].push} onChange={() => toggle(cat.id, 'push')} aria-label={`${cat.label} push notifications`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}