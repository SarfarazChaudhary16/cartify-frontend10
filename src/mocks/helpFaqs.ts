export type HelpFaqCategory = 'orders' | 'payments' | 'shipping' | 'returns' | 'account'

export interface HelpFaq {
  id: string
  category: HelpFaqCategory
  question: string
  answer: string
}

export const helpFaqCategories: { id: HelpFaqCategory; label: string }[] = [
  { id: 'orders', label: 'Orders' },
  { id: 'payments', label: 'Payments' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'account', label: 'Account' },
]

export const helpFaqs: HelpFaq[] = [
  { id: 'h-1', category: 'orders', question: 'How do I track my order?', answer: 'Go to Account > Orders and select the order you want to track. You\u2019ll see a live status timeline there.' },
  { id: 'h-2', category: 'orders', question: 'Can I change my order after placing it?', answer: 'Orders can be modified only before they\u2019re packed. Contact support immediately if you need to change size, color, or address.' },
  { id: 'h-3', category: 'orders', question: 'How do I cancel an order?', answer: 'From Account > Orders, open the order and select "Cancel Order" — this is available until the order is packed for shipping.' },
  { id: 'h-4', category: 'payments', question: 'What payment methods do you accept?', answer: 'UPI, credit/debit cards, net banking, popular wallets, and Cash on Delivery for eligible orders.' },
  { id: 'h-5', category: 'payments', question: 'Is Cash on Delivery available everywhere?', answer: 'COD is available in most serviceable pincodes for orders under \u20b950,000. You\u2019ll see the option at checkout if it applies to you.' },
  { id: 'h-6', category: 'payments', question: 'My payment failed but money was deducted. What now?', answer: 'Failed payments are auto-refunded within 5-7 business days. If it\u2019s been longer, please raise a support ticket with your transaction ID.' },
  { id: 'h-7', category: 'shipping', question: 'How long does delivery take?', answer: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available at checkout for an additional fee.' },
  { id: 'h-8', category: 'shipping', question: 'Do you ship internationally?', answer: 'Currently we only ship within India. International shipping is on our roadmap.' },
  { id: 'h-9', category: 'returns', question: 'What is your return policy?', answer: 'Unused items in original packaging can be returned within 14 days of delivery for a full refund.' },
  { id: 'h-10', category: 'returns', question: 'How long do refunds take?', answer: 'Once we receive the returned item, refunds are processed within 5-7 business days to your original payment method.' },
  { id: 'h-11', category: 'returns', question: 'Can I exchange instead of return?', answer: 'Yes — choose "Replace" instead of "Return" from your order details page, and we\u2019ll ship the replacement once the original is picked up.' },
  { id: 'h-12', category: 'account', question: 'How do I reset my password?', answer: 'Go to the login page and select "Forgot password?" — you\u2019ll receive a verification code by email.' },
  { id: 'h-13', category: 'account', question: 'How do I delete my account?', answer: 'Reach out via a support ticket and we\u2019ll process your account deletion request within 48 hours.' },
]