export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  category: string
  publishedAt: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 'b-1',
    title: 'How We Choose the Brands on Cartify',
    excerpt: 'A behind-the-scenes look at our sourcing process — quality checks, fair pricing, and the brands we said no to.',
    content: 'Every brand on Cartify goes through a three-stage review: product quality testing, pricing fairness against market rates, and a check on manufacturing practices. We reject roughly 60% of brands that apply. This piece walks through why, with real examples from our footwear and audio categories.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    author: 'Cartify Team',
    category: 'Behind the Scenes',
    publishedAt: '2026-06-10',
  },
  {
    id: 'b-2',
    title: 'The Monsoon Edit: Styling Guide',
    excerpt: 'Layering pieces, water-resistant fabrics, and colors that hide the mud — our field-tested monsoon picks.',
    content: 'Monsoon dressing is about fabric choice more than style. We tested ripstop nylon, quick-dry cotton blends, and treated canvas across three cities. Here\u2019s what held up, what didn\u2019t, and how to layer without overheating.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    author: 'Priya Nair',
    category: 'Style Guide',
    publishedAt: '2026-06-02',
  },
  {
    id: 'b-3',
    title: 'Sizing Across Brands: A Practical Guide',
    excerpt: 'Why a "Medium" from one brand fits like a "Small" from another, and how to shop with confidence.',
    content: 'Sizing isn\u2019t standardized across manufacturers, especially between footwear brands from different countries. We break down how to read a size chart properly and when to size up.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    author: 'Cartify Team',
    category: 'Guides',
    publishedAt: '2026-05-18',
  },
  {
    id: 'b-4',
    title: 'Inside Our Same-Day Dispatch Warehouse',
    excerpt: 'A tour of the fulfillment center that gets orders out the door in under 6 hours.',
    content: 'Same-day dispatch sounds simple until you\u2019ve seen the logistics behind it. We visited our Pune fulfillment center to see how orders move from "placed" to "packed" in under 6 hours on a normal day.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
    author: 'Arjun Mehta',
    category: 'Behind the Scenes',
    publishedAt: '2026-05-02',
  },
]