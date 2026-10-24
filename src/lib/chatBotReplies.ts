/** Canned "AI Assistant" replies keyed off simple keyword matches — a frontend-only stand-in for a real LLM/agent backend. */
export function getBotReply(userText: string): string {
  const t = userText.toLowerCase()
  if (t.includes('track') || t.includes('where') || t.includes('order')) {
    return "I can help with that! Head to Account > Orders to see live tracking, or share your order number and I'll look it up."
  }
  if (t.includes('return') || t.includes('refund') || t.includes('replace')) {
    return 'Returns are free within 14 days of delivery. Want me to start a return or replacement for a recent order?'
  }
  if (t.includes('payment') || t.includes('pay') || t.includes('upi') || t.includes('card')) {
    return 'We accept UPI, cards, net banking, wallets, and cash on delivery. Having trouble with a specific payment?'
  }
  if (t.includes('cancel')) {
    return "You can cancel any order that hasn't shipped yet from Account > Orders > Cancel Order."
  }
  if (t.includes('size') || t.includes('fit')) {
    return 'Check the size chart on the product page — if you\u2019re between sizes, we usually recommend sizing up.'
  }
  return "Thanks for reaching out! I've noted that down — is there anything specific I can help you find?"
}

export const agentGreeting = "Hi, this is Priya from Cartify support. I've got the context from your chat — how can I help further?"