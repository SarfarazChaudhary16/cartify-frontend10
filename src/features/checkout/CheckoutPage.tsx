import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { CheckoutSteps, type CheckoutStep } from './components/CheckoutSteps'
import { AddressStep } from './components/AddressStep'
import { ShippingStep, shippingOptions, type ShippingOption } from './components/ShippingStep'
import { PaymentStep, type PaymentMethodId } from './components/PaymentStep'
import { ReviewStep } from './components/ReviewStep'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useCartStore } from '@/store/useCartStore'
import { useOrdersStore } from '@/store/useOrdersStore'
import { useAddressesStore } from '@/store/useAddressesStore'
import { useAuthStore } from '@/store/useAuthStore'
import { apiClient } from '@/lib/apiClient'
import { loadRazorpayScript } from '@/lib/loadRazorpay'
import type { Address } from '@/types'

// Backend ke RazorpayOrderResponse DTO ka shape
interface RazorpayOrderData {
  razorpayOrderId: string
  keyId: string
  amount: number
  currency: string
  internalOrderId: number
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const user = useAuthStore((s) => s.user)

  const items = useCartStore((s) => s.items)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const placeOrder = useOrdersStore((s) => s.placeOrder)
  const addresses = useAddressesStore((s) => s.addresses)
  const fetchAddresses = useAddressesStore((s) => s.fetchAddresses)

  useEffect(() => {
    if (items.length === 0) fetchCart()
    if (addresses.length === 0) fetchAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [step, setStep] = useState<CheckoutStep>('address')
  const [address, setAddress] = useState<Address | null>(null)
  const [shippingId, setShippingId] = useState<ShippingOption['id']>('standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('upi')
  const [placing, setPlacing] = useState(false)

  const shipping = shippingOptions.find((o) => o.id === shippingId)!

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title="Your cart is empty"
          description="Add something to your cart before checking out."
          action={
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }

  // ===================================================================
  // MAIN FLOW — "Place Order" click hone pe ye chalta hai
  // ===================================================================
  async function handlePlaceOrder() {
    if (!address) return
    setPlacing(true)

    try {
      // ===== STEP 1: Order pehle SEEDHA backend mein ban jata hai =====
      // Chahe payment COD ho ya online — Order database mein PENDING
      // status ke saath ban hi jata hai. Online-payment ke case mein,
      // "paymentStatus" abhi khaali rahega jab tak Razorpay se verify
      // na ho jaye.
      // NAYA: Cart mein agar coupon apply tha, uska code bhi backend
      // ko bhejte hain — Order-total mein discount server-side apply hoga
      const appliedCoupon = useCartStore.getState().appliedCoupon
      const order = await placeOrder(address.id, paymentMethod, appliedCoupon?.code)

      // ===== STEP 2: COD hai to yahीं khatam — koi Razorpay nahi chahiye =====
      if (paymentMethod === 'cod') {
        await fetchCart() // cart backend ne already clear kiya, local state refresh
        navigate(`/checkout/success?order=${order.id}`)
        return
      }

      // ===== STEP 3: Online payment hai — Razorpay widget khोलते hain =====
      await openRazorpayCheckout(order.id)

    } catch (err: any) {
      toast({ type: 'error', title: 'Could not place order', description: err.response?.data?.message ?? 'Something went wrong.' })
      setPlacing(false)
    }
  }

  // ===================================================================
  // RAZORPAY WIDGET KHOLNA + VERIFY KARNA
  // ===================================================================
  async function openRazorpayCheckout(internalOrderId: string) {
    // Step A: Razorpay ka external script load karo (agar pehle se
    // load nahi hai to). Agar internet-issue ki wajah se load na ho
    // paye, user ko clearly bata dete hain.
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast({ type: 'error', title: 'Payment gateway failed to load', description: 'Please check your internet connection and try again.' })
      setPlacing(false)
      return
    }

    // Step B: Backend se Razorpay-order-details maangte hain
    // (POST /api/payments/create-order/{orderId}) — ye humara khud ka
    // banaya hua Order lekar, Razorpay ke server se ek "payment order"
    // banata hai aur uska ID + amount + hamari public-key wapas deta hai
    const response = await apiClient.post<RazorpayOrderData>(`/payments/create-order/${internalOrderId}`)
    const { razorpayOrderId, keyId, amount, currency } = response.data

    // Step C: Razorpay widget ke "options" banate hain — ye batata hai
    // widget ko KYA dikhana hai aur payment-successful hone par KYA karna hai
    const options = {
      key: keyId,               // hamari PUBLIC key (secret nahi hai, frontend ko dena safe hai)
      amount: amount,            // paise mein (backend already convert kar chuka hai)
      currency: currency,        // "INR"
      name: 'Cartify',
      description: 'Order Payment',
      order_id: razorpayOrderId, // Razorpay ka apna order-ID

      // ===== "prefill" — customer ka data pehले se bhar deta hai widget mein =====
      prefill: {
        name: user?.name ?? '',
        email: user?.email ?? '',
        contact: user?.phone ?? '',
      },

      // ===== "handler" — YE SABSE IMPORTANT PART HAI =====
      // Ye function TABHI chalta hai jab payment SUCCESSFUL ho jaye
      // widget ke andar. Razorpay khud ye function ko call karta hai,
      // aur humein 3 cheezein deta hai jinse hum backend pe VERIFY karenge.
      handler: async function (razorpayResponse: any) {
        try {
          await apiClient.post('/payments/verify', {
            internalOrderId: Number(internalOrderId),
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
          })

          // Verify successful — ab hi cart clear + success-page
          await fetchCart()
          navigate(`/checkout/success?order=${internalOrderId}`)
        } catch (err: any) {
          // Signature verify FAIL hui (jaise tampering ya koi glitch) —
          // order database mein bana rehta hai (PENDING), lekin payment
          // "confirmed" nahi hui. User ko clearly bataते hain.
          toast({ type: 'error', title: 'Payment verification failed', description: err.response?.data?.message })
          setPlacing(false)
        }
      },

      // ===== "modal.ondismiss" — jab user widget ko BEECH mein band kar de =====
      // (jaise "X" click kar de, payment complete kiye bina)
      modal: {
        ondismiss: function () {
          toast({ type: 'info', title: 'Payment cancelled', description: 'Your order is saved — you can retry payment from Order History.' })
          setPlacing(false)
        },
      },
    }

    // Step D: "window.Razorpay" — ye class abhi-abhi load hui script
    // se aayi hai. "as any" isliye use kiya hai kyunki TypeScript ko
    // pata nahi hota ki "window" pe "Razorpay" naam ki koi property
    // hai (kyunki ye external script se runtime pe aati hai, koi
    // TypeScript-type-definition humare paas nahi hai iske liye).
    const razorpayInstance = new (window as any).Razorpay(options)
    razorpayInstance.open()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Checkout</h1>

      <div className="mb-8">
        <CheckoutSteps current={step} />
      </div>

      {step === 'address' && (
        <AddressStep selectedId={address?.id ?? null} onSelect={setAddress} onNext={() => setStep('shipping')} />
      )}

      {step === 'shipping' && (
        <ShippingStep selected={shippingId} onSelect={setShippingId} onNext={() => setStep('payment')} onBack={() => setStep('address')} />
      )}

      {step === 'payment' && (
        <PaymentStep selected={paymentMethod} onSelect={setPaymentMethod} onNext={() => setStep('review')} onBack={() => setStep('shipping')} />
      )}

      {step === 'review' && address && (
        <ReviewStep
          address={address}
          shipping={shipping}
          paymentMethod={paymentMethod}
          onBack={() => setStep('payment')}
          onPlaceOrder={handlePlaceOrder}
          placing={placing}
        />
      )}
    </div>
  )
}