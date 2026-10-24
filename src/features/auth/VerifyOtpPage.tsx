import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { AuthCard } from './components/AuthCard'
import { OtpInput } from './components/OtpInput'
import { Button } from '@/components/ui/Button'
import { LogoutOverlay } from '@/components/ui/LogoutOverlay'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'

const RESEND_SECONDS = 30

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const resendOtp = useAuthStore((s) => s.resendOtp)

  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [resending, setResending] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [secondsLeft])

  async function handleComplete(code: string) {
    setVerifying(true)
    const result = await verifyOtp(email, code)
    setVerifying(false)
    if (result.success) {
      toast({ type: 'success', title: result.message })
      // NAYA: OTP verify hone ke baad ab Home-page pe navigate karte hain
      // (pehle seedha /account jata tha) — overlay dikhाके smooth transition
      setRedirecting(true)
      window.setTimeout(() => {
        navigate('/', { replace: true })
      }, 400)
    } else {
      setError(result.message)
    }
  }

  async function handleResend() {
    setResending(true)
    const result = await resendOtp(email, 'SIGNUP_VERIFICATION')
    setResending(false)
    setSecondsLeft(RESEND_SECONDS)
    setError('')
    setKey((k) => k + 1)
    toast({ type: 'success', title: result.message })
  }

  return (
    <>
      {redirecting && <LogoutOverlay message="Verified! Redirecting…" />}
      <AuthCard title="Verify your email" subtitle={`Enter the 6-digit code we sent to ${email}`}>
        <div className="text-center">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-500">
            <MailCheck className="h-6 w-6" />
          </span>

          <OtpInput key={key} onComplete={handleComplete} error={error} />

          {verifying && <p className="mt-3 text-xs text-ink-600 dark:text-porcelain-300/60">Verifying…</p>}

          <div className="mt-5">
            {secondsLeft > 0 ? (
              <p className="text-sm text-ink-600 dark:text-porcelain-300/60">Resend code in {secondsLeft}s</p>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleResend} loading={resending}>
                Resend Code
              </Button>
            )}
          </div>
        </div>
      </AuthCard>
    </>
  )
}