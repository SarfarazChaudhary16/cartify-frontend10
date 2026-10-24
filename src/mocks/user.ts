import type { Address, Coupon, Order, User } from '@/types'

export const currentUser: User = { id: 'u-1', name: 'Motu Sharma', email: 'motu@example.com', phone: '+91 98765 43210', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Motu', createdAt: '2025-11-02', role: 'customer' }
export const adminDemoUser: User = { id: 'u-admin', name: 'Cartify Admin', email: 'admin@cartify.example', phone: '+91 90000 00000', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Admin', createdAt: '2025-06-01', role: 'admin' }

export const addresses: Address[] = [
  { id: 'addr-1', label: 'Home', fullName: 'Motu Sharma', line1: '221B, Sunflower Heights', line2: 'Baner Road', city: 'Pune', state: 'Maharashtra', pincode: '411045', phone: '+91 98765 43210', isDefault: true },
  { id: 'addr-2', label: 'Office', fullName: 'Motu Sharma', line1: 'Softcell Technologies, 4th Floor', line2: 'Cybercity', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '+91 98765 43210' },
]
export const orders: Order[] = [
  { id: 'o-1', orderNumber: 'CF-10293',
    items: [{ productId: 'p-001', title: 'Northline Strider Runner', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', price: 6499, quantity: 1, color: 'Cobalt', size: 'UK 9' }],
    status: 'shipped', total: 6499, placedAt: '2026-07-11T09:05:00+05:30', estimatedDelivery: '2026-07-16', address: addresses[0], paymentMethod: 'UPI',
    trackingSteps: [
      { status: 'pending', label: 'Order placed', timestamp: '2026-07-11T09:05:00+05:30', completed: true },
      { status: 'packed', label: 'Packed', timestamp: '2026-07-11T18:00:00+05:30', completed: true },
      { status: 'shipped', label: 'Shipped', timestamp: '2026-07-13T09:20:00+05:30', completed: true },
      { status: 'out_for_delivery', label: 'Out for delivery', timestamp: '', completed: false },
      { status: 'delivered', label: 'Delivered', timestamp: '', completed: false },
    ] },
  { id: 'o-2', orderNumber: 'CF-10250',
    items: [{ productId: 'p-010', title: 'Loom & Co. Drift Fleece Hoodie', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300', price: 2199, quantity: 1, color: 'Sand', size: 'L' }],
    status: 'delivered', total: 2199, placedAt: '2026-07-05T12:00:00+05:30', address: addresses[0], paymentMethod: 'Card',
    trackingSteps: [
      { status: 'pending', label: 'Order placed', timestamp: '2026-07-05T12:00:00+05:30', completed: true },
      { status: 'packed', label: 'Packed', timestamp: '2026-07-05T20:00:00+05:30', completed: true },
      { status: 'shipped', label: 'Shipped', timestamp: '2026-07-07T09:00:00+05:30', completed: true },
      { status: 'delivered', label: 'Delivered', timestamp: '2026-07-11T14:10:00+05:30', completed: true },
    ] },
  { id: 'o-3', orderNumber: 'CF-10198',
    items: [{ productId: 'p-005', title: 'Loom & Co. Essential Oversized Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300', price: 1299, quantity: 2, color: 'Ink', size: 'M' }],
    status: 'refunded', total: 2598, placedAt: '2026-06-28T10:00:00+05:30', address: addresses[1], paymentMethod: 'COD',
    trackingSteps: [
      { status: 'pending', label: 'Order placed', timestamp: '2026-06-28T10:00:00+05:30', completed: true },
      { status: 'returned', label: 'Return picked up', timestamp: '2026-07-03T11:00:00+05:30', completed: true },
      { status: 'refunded', label: 'Refund processed', timestamp: '2026-07-07T16:20:00+05:30', completed: true },
    ] },
]
export const coupons: Coupon[] = [
  { code: 'WELCOME200', description: 'Flat ₹200 off on your first order', discountType: 'flat', discountValue: 200, minOrderValue: 1500, expiresAt: '2026-08-31' },
  { code: 'FLASH30', description: '30% off on Flash Sale items', discountType: 'percent', discountValue: 30, expiresAt: '2026-07-20' },
  { code: 'FREESHIP', description: 'Free shipping on all orders', discountType: 'flat', discountValue: 99, minOrderValue: 999, expiresAt: '2026-09-15' },
]

export interface GiftCard {
  code: string
  balance: number
}

export const giftCards: GiftCard[] = [
  { code: 'GIFT500', balance: 500 },
  { code: 'GIFT1000', balance: 1000 },
]
