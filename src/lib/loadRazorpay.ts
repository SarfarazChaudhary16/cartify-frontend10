/**
 * Razorpay ka checkout-widget ek EXTERNAL script hai (unke CDN se aati hai),
 * humare code mein "import" nahi ki ja sakti jaisi normal library. Isliye
 * ise runtime pe DYNAMICALLY <script> tag banake load karte hain.
 *
 * "id" check isliye hai taaki agar user checkout page pe DOBARA aaye
 * (jaise back-button se), script dobara load na ho — ek hi baar load
 * hone ke baad, "window.Razorpay" hamesha available rehta hai.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-script')) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'razorpay-checkout-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'

    // Script successfully load ho gayi -> "true" resolve karte hain
    script.onload = () => resolve(true)
    // Script load hi nahi hui (jaise internet-issue) -> "false"
    script.onerror = () => resolve(false)

    document.body.appendChild(script)
  })
}