export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Ritika Nair',
    location: 'Bengaluru',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Ritika',
    rating: 5,
    quote: "Ordered the Strider Runners on a Tuesday, they were on my feet by Thursday. The packaging alone felt like unboxing something from a store I'd never even heard of before — in a good way.",
  },
  {
    id: 't-2',
    name: 'Arjun Mehta',
    location: 'Pune',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Arjun',
    rating: 5,
    quote: "The size guide on the product page saved me an exchange. First time an ecommerce site actually got my hoodie fit right the first try.",
  },
  {
    id: 't-3',
    name: 'Sneha Kulkarni',
    location: 'Mumbai',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Sneha',
    rating: 4,
    quote: "Their flash sales are no joke. Got the Verve Aria headphones at 31% off and they still arrived two days early.",
  },
  {
    id: 't-4',
    name: 'Kabir Singh',
    location: 'Delhi',
    avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Kabir',
    rating: 5,
    quote: "Customer support actually resolved my return in one chat. No forms, no waiting three days for an email back.",
  },
]