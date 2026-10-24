import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ShoppingBag, Zap, Tag, Copy, Check } from 'lucide-react'
import { Rating } from '@/components/ui/Rating'
import { PriceTag } from '@/components/ui/PriceTag'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { apiClient } from '@/lib/apiClient'
import { ShareMenu } from './ShareMenu'
import type { Brand, Product } from '@/types'
import { cn } from '@/lib/utils'

interface ActiveCoupon {
  id: number
  code: string
  description: string
  discountType: string
  discountValue: number
  minOrderValue?: number
}

export function ProductInfo({ product, brand }: { product: Product; brand?: Brand }) {
  const [color, setColor] = useState(product.colors?.[0]?.name)
  const [size, setSize] = useState(product.sizes?.[0])
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  // NAYA: "Available Offers" ke liye — real e-commerce (Amazon/Flipkart)
  // jaisa, jahan Buy Now/Add to Cart ke turant neeche active-coupons
  // ki chhoti list dikhti hai
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [applyingOfferCode, setApplyingOfferCode] = useState<string | null>(null)
  const applyCoupon = useCartStore((s) => s.applyCoupon)

  const { toast } = useToast()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const wishlisted = useWishlistStore((s) => s.has(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)

  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 15

  useEffect(() => {
    apiClient
      .get<ActiveCoupon[]>('/coupons/active')
      .then((res) => setActiveCoupons(res.data))
      .catch(() => setActiveCoupons([]))
  }, [])

  function handleCopyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast({ type: 'success', title: `Copied "${code}"`, description: 'Apply it at checkout.' })
    window.setTimeout(() => setCopiedCode(null), 2000)
  }

  // NAYA: "Buy now with this offer" — ek click mein product cart mein
  // add hota hai, coupon apply hota hai, aur SEEDHA Checkout pe navigate
  // karte hain (Cart-page dikhaye bina) — user ko "direct buy" jaisa feel
  // aata hai, jabki backend ke liye ye SAME hi Cart-based flow hai
  // (security-design maintain rehta hai — client kabhi price decide nahi karta)
  async function handleBuyNowWithOffer(code: string) {
    if (outOfStock) return
    setApplyingOfferCode(code)
    try {
      await addItem(
        {
          id: '',
          productId: product.id,
          title: product.title,
          image: product.images[0]?.url ?? '',
          price: product.price,
          color,
          size,
        },
        quantity,
      )
      const result = await applyCoupon(code)
      if (!result.success) {
        toast({ type: 'error', title: 'Could not apply offer', description: result.message })
        // Coupon fail hua, lekin item to cart mein add ho hi chuka hai —
        // Cart-page pe le jate hain taaki user manually retry kar sake
        navigate('/cart')
        return
      }
      toast({ type: 'success', title: `${code} applied!`, description: 'Redirecting to checkout…' })
      navigate('/checkout')
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to add to cart', description: err.response?.data?.message })
    } finally {
      setApplyingOfferCode(null)
    }
  }

  async function handleAddToCart(navigateToCheckout = false) {
    if (outOfStock) return
    setAddingToCart(true)
    try {
      await addItem(
        {
          id: '',
          productId: product.id,
          title: product.title,
          image: product.images[0]?.url ?? '',
          price: product.price,
          color,
          size,
        },
        quantity,
      )
      if (navigateToCheckout) {
        navigate('/checkout')
      } else {
        toast({ type: 'success', title: 'Added to cart', description: `${product.title} × ${quantity}` })
      }
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to add to cart', description: err.response?.data?.message })
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div>
      {brand && (
        <Link to={`/brand/${brand.slug}`} className="text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
          {brand.name}
        </Link>
      )}
      <h1 className="mt-1 font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">{product.title}</h1>

      <div className="mt-2 flex items-center gap-3">
        <Rating value={product.rating} count={product.reviewCount} size="md" />
        <div className="flex gap-1.5">
          {product.isNew && <Badge variant="cobalt">New</Badge>}
          {product.isBestSeller && <Badge variant="gold">Best Seller</Badge>}
        </div>
      </div>

      <div className="mt-4">
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
      </div>

      <p className={cn('mt-2 text-sm font-medium', outOfStock ? 'text-danger-500' : lowStock ? 'text-warning-500' : 'text-success-500')}>
        {outOfStock ? 'Out of stock' : lowStock ? `Only ${product.stock} left in stock` : 'In stock'}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{product.description}</p>

      {product.colors && product.colors.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Color: <span className="font-normal text-ink-600 dark:text-porcelain-300/70">{color}</span></p>
          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                aria-pressed={color === c.name}
                title={c.name}
                className={cn('h-9 w-9 rounded-full border-2 transition-transform', color === c.name ? 'border-cobalt-500 scale-110' : 'border-porcelain-300 dark:border-ink-700')}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Size: <span className="font-normal text-ink-600 dark:text-porcelain-300/70">{size}</span></p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                  size === s
                    ? 'border-cobalt-500 bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400'
                    : 'border-porcelain-300 text-ink-700 hover:bg-porcelain-100 dark:border-ink-700 dark:text-porcelain-200 dark:hover:bg-ink-800',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">Quantity</p>
        <div className="flex items-center rounded-xl border border-porcelain-300 dark:border-ink-700">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="flex h-10 w-10 items-center justify-center text-ink-950 dark:text-porcelain-100">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="price w-8 text-center text-sm font-medium text-ink-950 dark:text-porcelain-100">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity" className="flex h-10 w-10 items-center justify-center text-ink-950 dark:text-porcelain-100">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button size="lg" className="flex-1" disabled={outOfStock} loading={addingToCart} leftIcon={<Zap className="h-4 w-4" />} onClick={() => handleAddToCart(true)}>
          Buy Now
        </Button>
        <Button size="lg" variant="outline" className="flex-1" disabled={outOfStock} loading={addingToCart} leftIcon={<ShoppingBag className="h-4 w-4" />} onClick={() => handleAddToCart(false)}>
          Add to Cart
        </Button>
      </div>

      {/* NAYA: Available Offers — 2 options har coupon ke saath:
          (1) "Copy" — manual, Cart-page pe jaake khud apply karna
          (2) "Buy now with this offer" — EK CLICK mein: product cart mein
              silently add hota hai, coupon apply hota hai, seedha
              Checkout pe navigate ho jata hai (Cart-page dikhaye bina) */}
      {activeCoupons.length > 0 && (
        <div className="mt-5 rounded-xl border border-porcelain-300 p-4 dark:border-ink-700">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink-950 dark:text-porcelain-100">
            <Tag className="h-4 w-4 text-cobalt-500" /> Available Offers
          </p>
          <div className="space-y-3">
            {activeCoupons.map((c) => (
              <div key={c.id} className="rounded-lg border border-porcelain-200 p-3 dark:border-ink-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 text-sm text-ink-600 dark:text-porcelain-300/70">
                    <span className="price font-semibold text-ink-950 dark:text-porcelain-100">{c.code}</span>
                    {' — '}
                    {c.discountType === 'FLAT' ? `₹${c.discountValue} off` : `${c.discountValue}% off`}
                    {c.minOrderValue ? ` on orders above ₹${c.minOrderValue}` : ''}
                    {c.description ? <span className="block text-xs text-ink-600/80 dark:text-porcelain-300/50">{c.description}</span> : null}
                  </div>
                  <button
                    onClick={() => handleCopyCode(c.code)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-cobalt-500/40 px-2.5 py-1 text-xs font-medium text-cobalt-600 transition-colors hover:bg-cobalt-500/10 dark:text-cobalt-400"
                  >
                    {copiedCode === c.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedCode === c.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <button
                  onClick={() => handleBuyNowWithOffer(c.code)}
                  disabled={outOfStock || applyingOfferCode === c.code}
                  className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-success-600 transition-colors hover:underline disabled:opacity-50 dark:text-success-500"
                >
                  <Zap className="h-3 w-3" />
                  {applyingOfferCode === c.code ? 'Applying…' : 'Buy now with this offer'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Heart className={cn('h-4 w-4', wishlisted && 'fill-danger-500 text-danger-500')} />}
          onClick={() => {
            toggleWishlist(product.id)
            toast({ type: wishlisted ? 'info' : 'success', title: wishlisted ? 'Removed from wishlist' : 'Added to wishlist' })
          }}
        >
          Wishlist
        </Button>
        <ShareMenu title={product.title} />
      </div>
    </div>
  )
}