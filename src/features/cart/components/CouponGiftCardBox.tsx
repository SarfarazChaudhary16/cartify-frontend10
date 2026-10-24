import { useEffect, useState } from 'react'
import { Tag, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/useCartStore'
import { apiClient } from '@/lib/apiClient'
import { formatPrice } from '@/lib/utils'

interface ActiveCoupon {
  id: number
  code: string
  description: string
  discountType: string
  discountValue: number
  minOrderValue?: number
}

export function CouponGiftCardBox() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [applying, setApplying] = useState(false)

  // NAYA: Admin ne jitne bhi ACTIVE coupons banaye hain, wo list yahan
  // fetch karke dikhate hain — taaki user ko khud "code kya hoga" guess
  // na karna pade, seedha list se pick kar sake
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([])
  const [loadingCoupons, setLoadingCoupons] = useState(true)

  const appliedCoupon = useCartStore((s) => s.appliedCoupon)
  const couponDiscount = useCartStore((s) => s.couponDiscount())
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)

  useEffect(() => {
    apiClient
      .get<ActiveCoupon[]>('/coupons/active')
      .then((res) => setActiveCoupons(res.data))
      .catch(() => setActiveCoupons([]))
      .finally(() => setLoadingCoupons(false))
  }, [])

  async function handleApply(codeToApply?: string) {
    const finalCode = codeToApply ?? code
    if (!finalCode.trim()) return
    setApplying(true)
    const result = await applyCoupon(finalCode)
    setApplying(false)
    // Backend "already used" / "expired" / "invalid" jaisa specific
    // message deta hai — wahi seedha dikha dete hain
    setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    if (result.success) setCode('')
  }

  return (
    <div className="surface-card p-5">
      <div className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink-950 dark:text-porcelain-100">
        <Tag className="h-3.5 w-3.5" /> Have a coupon?
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-xl bg-success-500/10 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium text-success-500">
            <Check className="h-4 w-4" /> {appliedCoupon.code} applied (-{formatPrice(couponDiscount)})
          </span>
          <button onClick={removeCoupon} aria-label="Remove coupon" className="text-success-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={message?.type === 'error' ? message.text : undefined}
              />
            </div>
            <Button onClick={() => handleApply()} loading={applying} className="shrink-0">
              Apply
            </Button>
          </div>

          {/* NAYA: Available coupons ki list — click karke seedha apply
              ho jata hai, manually type karne ki zarurat nahi */}
          {!loadingCoupons && activeCoupons.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-ink-600 dark:text-porcelain-300/60">Available coupons</p>
              {activeCoupons.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleApply(c.code)}
                  disabled={applying}
                  className="flex w-full items-center justify-between rounded-xl border border-dashed border-cobalt-500/40 bg-cobalt-500/5 px-4 py-2.5 text-left transition-colors hover:bg-cobalt-500/10"
                >
                  <div>
                    <p className="text-sm font-semibold text-cobalt-600 dark:text-cobalt-400">{c.code}</p>
                    <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{c.description}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-cobalt-600 dark:text-cobalt-400">
                    {c.discountType === 'FLAT' ? `₹${c.discountValue} off` : `${c.discountValue}% off`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {message?.type === 'success' && !appliedCoupon && (
        <p className="mt-1.5 text-xs font-medium text-success-500">{message.text}</p>
      )}
    </div>
  )
}