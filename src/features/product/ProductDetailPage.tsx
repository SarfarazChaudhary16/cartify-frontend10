import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, PackageX } from 'lucide-react'
import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'
import { ProductTabs } from './components/ProductTabs'
import { ProductRail } from '@/components/shared/ProductRail'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useProductsStore } from '@/store/useProductsStore'
import { useBrandsStore } from '@/store/useBrandsStore'

export default function ProductDetailPage() {
  const { slug } = useParams()

  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)
  const brands = useBrandsStore((s) => s.brands)
  const fetchBrands = useBrandsStore((s) => s.fetchBrands)

  useEffect(() => {
    if (products.length === 0) fetchProducts()
    if (brands.length === 0) fetchBrands()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const product = products.find((p) => p.slug === slug)

  // NOTE: Yahan hum poora Brand object (logo samet) chahte hain
  // ProductInfo component ke liye — isliye seedha "brands" store se
  // dhoondh rahe hain (product.brandName/brandSlug mein logo nahi hota,
  // wo backend ke ProductResponse mein include nahi kiya gaya tha)
  const brand = useMemo(() => brands.find((b) => b.id === product?.brandId), [brands, product])

  const related = useMemo(
    () => (product ? products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id) : []),
    [products, product],
  )
  const similar = useMemo(
    () => (product ? products.filter((p) => p.brandId === product.brandId && p.id !== product.id) : []),
    [products, product],
  )

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={<PackageX className="h-7 w-7" />}
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          action={
            <Link to="/products">
              <Button variant="outline">Browse all products</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-600 dark:text-porcelain-300/60">
          <Link to="/" className="hover:text-cobalt-600 dark:hover:text-cobalt-400">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-cobalt-600 dark:hover:text-cobalt-400">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-950 dark:text-porcelain-100">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />
          <ProductInfo product={product} brand={brand} />
        </div>

        <div className="mt-12">
          <ProductTabs product={product} />
        </div>
      </div>

      {related.length > 0 && <ProductRail eyebrow="You might also like" title="Related Products" products={related} />}
      {similar.length > 0 && <ProductRail eyebrow={`More from ${brand?.name ?? 'this brand'}`} title="Similar Products" products={similar} />}
    </div>
  )
}