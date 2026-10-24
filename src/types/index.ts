export interface Category { id: string; name: string; slug: string; image: string; parentId?: string | null; productCount: number }
export interface Brand { id: string; name: string; slug: string; logo: string; description?: string }
export interface ProductVariant { id: string; color?: string; colorHex?: string; size?: string; sku: string; stock: number; priceOverride?: number }
export interface ProductImage { id: string; url: string; alt: string }
export interface ProductReview {
  id: string; productId: string; userId: string; userName: string; userAvatar?: string
  rating: number; title: string; comment: string; images?: string[]
  helpfulCount: number; verifiedPurchase: boolean; createdAt: string
}
export interface Product {
  id: string; slug: string; title: string; brandId: string; categoryId: string; description: string
  images: ProductImage[]; price: number; compareAtPrice?: number; currency: 'INR'
  rating: number; reviewCount: number; stock: number; tags: string[]
  colors?: { name: string; hex: string }[]; sizes?: string[]; variants?: ProductVariant[]
  specifications: { label: string; value: string }[]
  isNew?: boolean; isBestSeller?: boolean; isFlashSale?: boolean; discountPercent?: number
  material?: string; createdAt: string
}
export interface CartItem {
  id: string; productId: string; variantId?: string; title: string; image: string
  price: number; quantity: number; color?: string; size?: string; savedForLater?: boolean
}
export interface WishlistItem { id: string; productId: string; addedAt: string }
export interface Address {
  id: string; label: string; fullName: string; line1: string; line2?: string
  city: string; state: string; pincode: string; phone: string; isDefault?: boolean
}
export type OrderStatus = 'pending' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded'
export interface OrderItem { productId: string; title: string; image: string; price: number; quantity: number; color?: string; size?: string }
export interface Order {
  id: string; orderNumber: string; items: OrderItem[]; status: OrderStatus; total: number
  placedAt: string; estimatedDelivery?: string; address: Address; paymentMethod: string
  trackingSteps: { status: OrderStatus; label: string; timestamp: string; completed: boolean }[]
}
export type NotificationCategory = 'orders' | 'offers' | 'wishlist' | 'system' | 'account'
export interface AppNotification {
  id: string; category: NotificationCategory; title: string; message: string
  isRead: boolean; createdAt: string; icon?: string; actionUrl?: string
}
export interface User { id: string; name: string; email: string; phone?: string; avatar?: string; createdAt: string }
export interface Coupon { code: string; description: string; discountType: 'percent' | 'flat'; discountValue: number; minOrderValue?: number; expiresAt: string }
export interface ChatMessage {
  id: string; sender: 'user' | 'agent' | 'ai'; text: string; timestamp: string
  attachments?: { type: 'image' | 'file'; url: string; name: string }[]
}
export type SortOption = 'relevance' | 'price_low_high' | 'price_high_low' | 'newest' | 'rating' | 'discount'
export interface ProductFilters {
  categoryIds?: string[]; brandIds?: string[]; priceRange?: [number, number]; minRating?: number
  colors?: string[]; sizes?: string[]; minDiscount?: number; inStockOnly?: boolean; materials?: string[]
}

export interface User { id: string; name: string; email: string; phone?: string; avatar?: string; createdAt: string; role: 'customer' | 'admin' }