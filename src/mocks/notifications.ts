import type { AppNotification } from '@/types'
export const notifications: AppNotification[] = [
  { id: 'n-1', category: 'orders', title: 'Order shipped', message: 'Your order #CF-10293 has shipped and is on its way.', isRead: false, createdAt: '2026-07-13T09:20:00+05:30' },
  { id: 'n-2', category: 'offers', title: 'Flash Sale starts now', message: 'Up to 40% off Audio & Footwear — 6 hours only.', isRead: false, createdAt: '2026-07-13T08:00:00+05:30' },
  { id: 'n-3', category: 'wishlist', title: 'Price dropped', message: 'Auric Meridian Chronograph is now ₹18,999 (was ₹23,999).', isRead: false, createdAt: '2026-07-12T18:45:00+05:30' },
  { id: 'n-4', category: 'orders', title: 'Order delivered', message: 'Order #CF-10250 was delivered. How was it?', isRead: true, createdAt: '2026-07-11T14:10:00+05:30' },
  { id: 'n-5', category: 'account', title: 'Payment successful', message: '₹6,499 was charged for order #CF-10293.', isRead: true, createdAt: '2026-07-11T09:05:00+05:30' },
  { id: 'n-6', category: 'system', title: 'New arrivals in Apparel', message: 'Loom & Co. just dropped their Monsoon Edit.', isRead: true, createdAt: '2026-07-10T11:30:00+05:30' },
  { id: 'n-7', category: 'offers', title: 'Coupon available', message: 'Use WELCOME200 for ₹200 off your next order.', isRead: true, createdAt: '2026-07-09T10:00:00+05:30' },
  { id: 'n-8', category: 'orders', title: 'Refund processed', message: 'Your refund of ₹2,199 has been credited.', isRead: true, createdAt: '2026-07-07T16:20:00+05:30' },
]
