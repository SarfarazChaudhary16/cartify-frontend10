import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { Logo } from '@/components/layout/header/Logo'

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/products?filter=new' },
      { label: 'Flash Sale', to: '/products?filter=flash-sale' },
      { label: 'Best Sellers', to: '/products' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Track Order', to: '/account/orders' },
      { label: 'Shipping Policy', to: '/shipping-policy' },
      { label: 'Refund Policy', to: '/refund-policy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Cartify', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
    ],
  },
]

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-porcelain-300 bg-porcelain-100 dark:border-ink-700 dark:bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ink-600 dark:text-porcelain-300/60">
              Premium ecommerce, reimagined. Curated products, honest pricing, fast delivery.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-porcelain-200 text-ink-600 transition-colors hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-300/70 dark:hover:bg-ink-700"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold text-ink-950 dark:text-porcelain-100">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-ink-600 transition-colors hover:text-cobalt-600 dark:text-porcelain-300/60 dark:hover:text-cobalt-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-porcelain-300 pt-6 text-xs text-ink-600 sm:flex-row dark:border-ink-700 dark:text-porcelain-300/50">
          <p>© {new Date().getFullYear()} Cartify. All rights reserved.</p>
          <p>Built as a full-stack portfolio project · React + Spring Boot</p>
        </div>
      </div>
    </footer>
  )
}