import { useEffect, useMemo } from 'react'
import { HeroBanner } from './components/HeroBanner'
import { FeaturedCategories } from './components/FeaturedCategories'
import { ProductRail } from '@/components/shared/ProductRail'
import { FlashSaleSection } from './components/FlashSaleSection'
import { TopBrands } from './components/TopBrands'
import { Testimonials } from './components/Testimonials'
import { InstagramGallery } from './components/InstagramGallery'
import { Newsletter } from './components/Newsletter'
import { useProductsStore } from '@/store/useProductsStore'

export default function HomePage() {
  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)

  useEffect(() => {
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const trending = useMemo(() => [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8), [products])
  const newArrivals = useMemo(() => products.filter((p) => p.isNew), [products])
  const bestSellers = useMemo(() => products.filter((p) => p.isBestSeller), [products])
  const recommended = useMemo(() => [...products].sort(() => 0.5 - Math.random()).slice(0, 8), [products])
  const recentlyViewed = products.slice(0, 6)

  return (
    <div>
      <HeroBanner />
      <FeaturedCategories />
      <ProductRail eyebrow="Right now" title="Trending Products" viewAllHref="/products" products={trending} />
      <FlashSaleSection />
      <ProductRail eyebrow="Just dropped" title="New Arrivals" viewAllHref="/products?filter=new" products={newArrivals} />
      <TopBrands />
      <ProductRail eyebrow="Most loved" title="Best Sellers" viewAllHref="/products" products={bestSellers} />
      <ProductRail eyebrow="For you" title="Recommended" description="Based on what shoppers like you are buying." products={recommended} />
      <Testimonials />
      <ProductRail eyebrow="Pick up where you left off" title="Recently Viewed" products={recentlyViewed} />
      <InstagramGallery />
      <Newsletter />
    </div>
  )
}