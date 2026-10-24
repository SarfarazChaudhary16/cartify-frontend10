export interface Faq {
  id: string
  question: string
  answer: string
}

/** Generic product-page FAQ tab — shipping/returns/sizing questions common to every listing. */
export const productFaqs: Faq[] = [
  { id: 'faq-1', question: 'How long does delivery take?', answer: 'Most orders arrive within 3-5 business days. You\u2019ll get tracking details by email as soon as your order ships.' },
  { id: 'faq-2', question: 'What is your return policy?', answer: 'Unused items in original packaging can be returned within 14 days of delivery for a full refund. See our Refund Policy for details.' },
  { id: 'faq-3', question: 'Is Cash on Delivery available?', answer: 'Yes, COD is available for orders under \u20b950,000 in most serviceable pincodes.' },
  { id: 'faq-4', question: 'How do I know what size to order?', answer: 'Check the size chart linked on this page. If you\u2019re between sizes, we generally recommend sizing up.' },
  { id: 'faq-5', question: 'Is this product covered by warranty?', answer: 'Manufacturing defects are covered for 6 months from the delivery date. Normal wear and accidental damage aren\u2019t covered.' },
]