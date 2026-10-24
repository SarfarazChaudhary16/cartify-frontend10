import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NotificationCategory } from '@/types'

type Channel = 'email' | 'push'
type Prefs = Record<NotificationCategory, Record<Channel, boolean>>

interface NotificationPrefsState {
  prefs: Prefs
  toggle: (category: NotificationCategory, channel: Channel) => void
}

const defaultPrefs: Prefs = {
  orders: { email: true, push: true },
  offers: { email: true, push: false },
  wishlist: { email: true, push: true },
  system: { email: false, push: true },
  account: { email: true, push: true },
}

/** Per-category email/push toggles — Account > Notifications. */
export const useNotificationPrefsStore = create<NotificationPrefsState>()(
  persist(
    (set) => ({
      prefs: defaultPrefs,
      toggle: (category, channel) =>
        set((state) => ({
          prefs: { ...state.prefs, [category]: { ...state.prefs[category], [channel]: !state.prefs[category][channel] } },
        })),
    }),
    { name: 'cartify-notification-prefs' },
  ),
)