import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react'
import { AuthCard } from './components/AuthCard'
import { OtpInput } from './components/OtpInput'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'

type Step = 'email' | 'otp'

/** Forgot password: email → OTP sent to that email → verify → land on Reset Password. No email links involved. */
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset)
  const verifyPasswordResetOtp = useAuthStore((s) => s.verifyPasswordResetOtp)

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otpKey, setOtpKey] = useState(0)

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address.')
      return
    }
    setEmailError('')
    setLoading(true)
    const result = await requestPasswordReset(email)
    setLoading(false)
    if (result.success) {
      toast({ type: 'success', title: result.message })
      setStep('otp')
    } else {
      setEmailError(result.message)
    }
  }

  async function handleOtpComplete(code: string) {
    setVerifying(true)
    const result = await verifyPasswordResetOtp(email, code)
    setVerifying(false)
    if (result.success) {
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } else {
      setOtpError(result.message)
    }
  }

  async function handleResend() {
    setLoading(true)
    const result = await requestPasswordReset(email)
    setLoading(false)
    setOtpError('')
    setOtpKey((k) => k + 1)
    toast({ type: 'success', title: result.message })
  }

  return (
    <AuthCard
      title={step === 'email' ? 'Forgot your password?' : 'Enter the code'}
      subtitle={step === 'email' ? "Enter your email and we'll send you a verification code" : `We sent a 6-digit code to ${email}`}
    >
      <AnimatePresence mode="wait">
        {step === 'email' ? (
          <motion.form key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Send Code
            </Button>
          </motion.form>
        ) : (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-500">
              <ShieldCheck className="h-6 w-6" />
            </span>

            <OtpInput key={otpKey} onComplete={handleOtpComplete} error={otpError} />

            {verifying && <p className="mt-3 text-xs text-ink-600 dark:text-porcelain-300/60">Verifying…</p>}

            <Button variant="ghost" size="sm" className="mt-3" onClick={handleResend} loading={loading}>
              Resend Code
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-600 dark:text-porcelain-300/70">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
      </Link>
    </AuthCard>
  )
}