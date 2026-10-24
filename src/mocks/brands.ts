import type { Brand } from '@/types'
export const brands: Brand[] = [
  { id: 'brand-1', name: 'Northline', slug: 'northline', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Northline&backgroundType=solid', description: 'Performance footwear engineered for the everyday athlete.' },
  { id: 'brand-2', name: 'Auric', slug: 'auric', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Auric&backgroundType=solid', description: 'Watches and timepieces built for a lifetime.' },
  { id: 'brand-3', name: 'Fieldstone', slug: 'fieldstone', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Fieldstone&backgroundType=solid', description: 'Rugged bags and travel gear.' },
  { id: 'brand-4', name: 'Verve Audio', slug: 'verve-audio', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Verve&backgroundType=solid', description: 'Sound, uncompromised.' },
  { id: 'brand-5', name: 'Loom & Co.', slug: 'loom-co', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Loom&backgroundType=solid', description: 'Everyday apparel, thoughtfully made.' },
  { id: 'brand-6', name: 'Solstice', slug: 'solstice', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Solstice&backgroundType=solid', description: 'Eyewear for every season.' },
]

export const getBrandBySlug = (slug: string) => brands.find((b) => b.slug === slug)