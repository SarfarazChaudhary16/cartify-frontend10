import { Bell, ShoppingBag, Tag, Heart, Info, Settings } from 'lucide-react'
import type { NotificationCategory } from '@/types'

export const notificationIcon: Record<NotificationCategory, typeof Bell> = {
  orders: ShoppingBag,
  offers: Tag,
  wishlist: Heart,
  system: Info,
  account: Settings,
}

export const notificationCategoryLabel: Record<NotificationCategory, string> = {
  orders: 'Orders',
  offers: 'Offers',
  wishlist: 'Wishlist',
  system: 'System',
  account: 'Account',
}