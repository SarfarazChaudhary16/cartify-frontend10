import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AuthCard } from './components/AuthCard'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { LogoutOverlay } from '@/components/ui/LogoutOverlay'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    const result = await login(email, password, remember)
    setLoading(false)

    if (result.success) {
      toast({ type: 'success', title: result.message })

      const intendedFrom = (location.state as { from?: string } | undefined)?.from

      setRedirecting(true)
      window.setTimeout(() => {
        navigate(intendedFrom ?? '/', { replace: true })
      }, 400)
    } else {
      setErrors({ password: result.message })
    }
  }

  return (
    <>
      {redirecting && <LogoutOverlay message="Welcome back! Redirecting…" />}
      <AuthCard title="Welcome back" subtitle="Log in to continue to Cartify">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="h-4 w-4" />}
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <Link to="/forgot-password" className="text-sm font-medium text-cobalt-600 dark:text-cobalt-400">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600 dark:text-porcelain-300/70">
          New to Cartify?{' '}
          <Link to="/signup" className="font-medium text-cobalt-600 dark:text-cobalt-400">
            Create an account
          </Link>
        </p>
      </AuthCard>
    </>
  )
}