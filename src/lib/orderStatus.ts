import type { OrderStatus } from '@/types'

type BadgeVariant = 'neutral' | 'cobalt' | 'gold' | 'success' | 'danger' | 'warning'

export const orderStatusVariant: Record<OrderStatus, BadgeVariant> = {
  pending: 'warning',
  packed: 'cobalt',
  shipped: 'cobalt',
  out_for_delivery: 'cobalt',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'neutral',
  refunded: 'neutral',
}

export function formatOrderStatus(status: OrderStatus): string {
  return status.replace(/_/g, ' ')
}

/** Forward status progression for the normal fulfillment flow (admin "advance status" action). */
export const nextOrderStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'packed',
  packed: 'shipped',
  shipped: 'out_for_delivery',
  out_for_delivery: 'delivered',
}

export const nextOrderStatusLabel: Partial<Record<OrderStatus, string>> = {
  pending: 'Mark as Packed',
  packed: 'Mark as Shipped',
  shipped: 'Mark Out for Delivery',
  out_for_delivery: 'Mark as Delivered',
}

/** Orders sitting in 'cancelled' or 'returned' that still need a refund processed. */
export const refundableStatuses: OrderStatus[] = ['cancelled', 'returned']