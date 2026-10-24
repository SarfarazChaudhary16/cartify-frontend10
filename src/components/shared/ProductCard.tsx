import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { PriceTag } from '@/components/ui/PriceTag'
import { useToast } from '@/components/ui/Toast'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useBrandsStore } from '@/store/useBrandsStore'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { toast } = useToast()
  const addItem = useCartStore((s) => s.addItem)
  const wishlisted = useWishlistStore((s) => s.has(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)

  // NAYA: mocks/brands ki jagah REAL backend-backed store use kar rahe
  // hain — warna galat/purane brand names dikh sakte the
  const brands = useBrandsStore((s) => s.brands)
  const brand = brands.find((b) => b.id === product.brandId)

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setAddingToCart(true)
    try {
      await addItem({
        id: '',
        productId: product.id,
        title: product.title,
        image: product.images[0]?.url ?? '',
        price: product.price,
        color: product.colors?.[0]?.name,
        size: product.sizes?.[0],
      })
      toast({ type: 'success', title: 'Added to cart', description: product.title })
    } catch (err: any) {
      // NAYA: PEHLE ye error silently gayab ho jata tha (koi try-catch
      // hi nahi tha) — ab actual backend-error dikhega, jaise
      // "401 Unauthorized" agar login nahi ho, ya koi aur asli wajah
      toast({ type: 'error', title: 'Failed to add to cart', description: err.response?.data?.message ?? err.message })
    } finally {
      setAddingToCart(false)
    }
  }

 async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const wasWishlisted = wishlisted
    try {
      toggleWishlist(product.id)
      toast({
        type: wasWishlisted ? 'info' : 'success',
        title: wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        description: product.title,
      })
    } catch (err: any) {
      toast({ type: 'error', title: 'Wishlist update failed', description: err.response?.data?.message ?? err.message })
    }
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className={cn('surface-card surface-card-lift group block overflow-hidden', className)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-porcelain-200 dark:bg-ink-800">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-porcelain-300/70 dark:bg-ink-700/70" />}
        <motion.img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt ?? product.title}
          onLoad={() => setImgLoaded(true)}
          className={cn('h-full w-full object-cover transition-opacity duration-300', imgLoaded ? 'opacity-100' : 'opacity-0')}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="cobalt">New</Badge>}
          {product.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
          {product.discountPercent && <Badge variant="danger">{product.discountPercent}% off</Badge>}
        </div>

        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-sm backdrop-blur transition-transform hover:scale-105 dark:bg-ink-900/90 dark:text-porcelain-100"
        >
          <Heart className={cn('h-4 w-4 transition-colors', wishlisted && 'fill-danger-500 text-danger-500')} />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleQuickAdd}
            disabled={addingToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950/90 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-ink-950 dark:bg-white/90 dark:text-ink-950 dark:hover:bg-white"
          >
            <ShoppingBag className="h-4 w-4" /> Quick add
          </button>
        </div>
      </div>

      <div className="space-y-1.5 p-4">
        {brand && <p className="text-xs font-medium text-ink-600 dark:text-porcelain-300/60">{brand.name}</p>}
        <h3 className="line-clamp-1 text-sm font-medium text-ink-950 dark:text-porcelain-100">{product.title}</h3>
        <Rating value={product.rating} count={product.reviewCount} />
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
      </div>
    </Link>
  )
}