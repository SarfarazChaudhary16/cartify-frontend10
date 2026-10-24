import type { ChatMessage, ProductReview } from '@/types'
export const reviews: ProductReview[] = [
  { id: 'rev-1', productId: 'p-001', userId: 'u-2', userName: 'Ankit R.', rating: 5, title: 'Best running shoe under 7k', comment: 'Wore these for a half marathon training block — zero blisters, great cushioning.', helpfulCount: 42, verifiedPurchase: true, createdAt: '2026-06-02' },
  { id: 'rev-2', productId: 'p-001', userId: 'u-3', userName: 'Priya M.', rating: 4, title: 'Great, runs slightly narrow', comment: 'Go half a size up if you have wider feet.', helpfulCount: 18, verifiedPurchase: true, createdAt: '2026-06-14' },
  { id: 'rev-3', productId: 'p-004', userId: 'u-4', userName: 'Sameer K.', rating: 5, title: 'ANC is genuinely excellent', comment: "Used these on a 9-hour flight, battery didn't even hit 50%.", helpfulCount: 67, verifiedPurchase: true, createdAt: '2026-04-20' },
]
export const chatHistory: ChatMessage[] = [
  { id: 'c-1', sender: 'ai', text: "Hi! I'm Cartify's AI assistant. How can I help you today?", timestamp: '2026-07-14T10:00:00+05:30' },
  { id: 'c-2', sender: 'user', text: 'Hey, when will my order CF-10293 arrive?', timestamp: '2026-07-14T10:01:00+05:30' },
  { id: 'c-3', sender: 'ai', text: 'Your order shipped yesterday and is expected by July 16. Want me to show the live tracking?', timestamp: '2026-07-14T10:01:20+05:30' },
]
export const quickReplies = ['Track my order', 'Start a return', 'Talk to a human', 'Payment issue']
export const suggestedFaqs = ['How do I return an item?', 'What payment methods are accepted?', 'How long does delivery take?', 'How do I cancel an order?']
