export interface NavLink {
  label: string
  path: string
}

/** Primary desktop/mobile nav links. "Shop" opens the mega menu instead of navigating directly. */
export const navLinks: NavLink[] = [
  { label: 'New Arrivals', path: '/products?filter=new' },
  { label: 'Flash Sale', path: '/products?filter=flash-sale' },
  { label: 'Brands', path: '/products' },
  { label: 'About', path: '/about' },
]