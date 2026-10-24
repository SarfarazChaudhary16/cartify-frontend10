import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { AuthCard } from './components/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'password' | 'confirmPassword', string>>

export default function SignupPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const signup = useAuthStore((s) => s.signup)

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) nextErrors.phone = 'Enter a valid phone number.'
    if (form.password.length < 8) nextErrors.password = 'At least 8 characters.'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    const result = await signup(form)
    setLoading(false)

    if (result.success) {
      toast({ type: 'success', title: result.message })
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`)
    } else {
      toast({ type: 'error', title: 'Signup failed', description: result.message })
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Join Cartify for faster checkout and order tracking" wide>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} leftIcon={<User className="h-4 w-4" />} />

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} leftIcon={<Mail className="h-4 w-4" />} />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} leftIcon={<Phone className="h-4 w-4" />} />
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} leftIcon={<Lock className="h-4 w-4" />} />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} leftIcon={<Lock className="h-4 w-4" />} />
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-600 dark:text-porcelain-300/70">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-cobalt-600 dark:text-cobalt-400">
          Log in
        </Link>
      </p>
    </AuthCard>
  )
}