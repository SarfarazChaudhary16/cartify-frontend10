import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProductCard } from '@/components/shared/ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useProductsStore } from '@/store/useProductsStore'

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => s.productIds)
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)

  // NAYA: useWishlistStore ab sirf "productIds" (numbers-as-strings)
  // rakhta hai — poora Product-detail (image/title/price) nahi. Isliye
  // humein poora catalog bhi chahiye (useProductsStore se) taaki in IDs
  // se ACTUAL products dhoondh sakein — bilkul jaisa mock-version mein
  // "products" import karke filter kiya jata tha, bas ab dono REAL
  // backend se aa rahe hain.


  const products = useProductsStore((s) => s.products)
  const fetchProducts = useProductsStore((s) => s.fetchProducts)

  useEffect(() => {
    fetchWishlist()
    if (products.length === 0) fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const items = products.filter((p) => productIds.includes(p.id))

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={<Heart className="h-7 w-7" />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          action={
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Wishlist</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{items.length} saved items</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}