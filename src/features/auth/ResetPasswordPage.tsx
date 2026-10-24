import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthCard } from './components/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const resetPassword = useAuthStore((s) => s.resetPassword)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // Agar kisi wajah se URL mein "?email=..." missing ho (jaise koi
    // seedha is page ka URL type kar de bina forgot-password flow follow
    // kiye), to backend ko khaali email nahi bhej sakte — user ko error
    // dikha ke rok dete hain.
    if (!email) {
      setErrors({ password: 'Missing email — please restart the forgot-password process.' })
      return
    }

    setLoading(true)
    // NAYA: resetPassword ab (email, newPassword) dono maangta hai —
    // backend ke ResetPasswordRequest DTO ko dono chahiye
    const result = await resetPassword(email, password)
    setLoading(false)

    if (result.success) {
      setDone(true)
    } else {
      // Backend se aaya actual error-message dikhate hain (jaise "No
      // password reset request found. Please start over.")
      setErrors({ password: result.message })
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle={email ? `Choose a new password for ${email}` : 'Choose a new password for your account'}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-500/10 text-success-500">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm text-ink-600 dark:text-porcelain-300/70">Your password has been updated.</p>
            <Button className="mt-5 w-full" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
            <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} leftIcon={<Lock className="h-4 w-4" />} />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} leftIcon={<Lock className="h-4 w-4" />} />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Update Password
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthCard>
  )
}