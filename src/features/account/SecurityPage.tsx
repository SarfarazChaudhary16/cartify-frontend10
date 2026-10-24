import { useState, type FormEvent } from 'react'
import { Lock, Smartphone, Monitor, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { useToast } from '@/components/ui/Toast'
import { apiClient } from '@/lib/apiClient'

// NOTE: "Active Sessions" list neeche mock/cosmetic hai — backend session-
// tracking support nahi karta (JWT stateless hai, koi session-table nahi
// hai). "Two-Factor Authentication" bhi purely cosmetic hai abhi, koi
// backend implementation nahi. Dono UI mein rakhe hain demo ke liye,
// lekin inka koi real security-effect nahi hai.
const sessions = [
  { id: 's-1', device: 'Chrome on Windows', location: 'Pune, India', lastActive: 'Active now', current: true },
  { id: 's-2', device: 'Cartify App on Android', location: 'Pune, India', lastActive: '2 days ago', current: false },
]

export default function SecurityPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({})
  const [saving, setSaving] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!form.current) nextErrors.current = 'Enter your current password.'
    if (form.next.length < 8) nextErrors.next = 'Use at least 8 characters.'
    if (form.confirm !== form.next) nextErrors.confirm = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      // NAYA: Real backend call — currentPassword ko backend khud
      // verify karega (BCrypt se), aur naya password hash karke save karega
      await apiClient.put('/users/me/change-password', {
        currentPassword: form.current,
        newPassword: form.next,
      })
      setForm({ current: '', next: '', confirm: '' })
      toast({ type: 'success', title: 'Password updated' })
    } catch (err: any) {
      // Backend "Current password is incorrect." jaisa specific error deta hai
      const message = err.response?.data?.message ?? 'Failed to update password.'
      setErrors({ current: message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Security</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Manage your password and account access.</p>

      <div className="surface-card mt-6 p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Change Password</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Current Password" type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} error={errors.current} leftIcon={<Lock className="h-4 w-4" />} />
          </div>
          <Input label="New Password" type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} error={errors.next} leftIcon={<Lock className="h-4 w-4" />} />
          <Input label="Confirm New Password" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} leftIcon={<Lock className="h-4 w-4" />} />
          <div className="sm:col-span-2">
            <Button type="submit" loading={saving}>Update Password</Button>
          </div>
        </form>
      </div>

      <div className="surface-card mt-6 flex items-center justify-between p-6">
        <div>
          <h2 className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Two-Factor Authentication</h2>
          <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Add an extra layer of security using an authenticator app.</p>
        </div>
        <Switch
          checked={twoFactor}
          onChange={(e) => {
            setTwoFactor(e.target.checked)
            toast({ type: 'success', title: e.target.checked ? '2FA enabled' : '2FA disabled' })
          }}
        />
      </div>

      <div className="surface-card mt-6">
        <h2 className="border-b border-porcelain-300 px-6 py-4 text-sm font-semibold text-ink-950 dark:border-ink-700 dark:text-porcelain-100">Active Sessions</h2>
        <div className="divide-y divide-porcelain-300 dark:divide-ink-700">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-6 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-porcelain-200 text-ink-600 dark:bg-ink-800 dark:text-porcelain-300/70">
                {s.device.includes('App') ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">
                  {s.device} {s.current && <span className="text-success-500">· This device</span>}
                </p>
                <p className="text-xs text-ink-600 dark:text-porcelain-300/60">{s.location} · {s.lastActive}</p>
              </div>
              {!s.current && (
                <button
                  onClick={() => toast({ type: 'info', title: 'Session logged out' })}
                  className="flex items-center gap-1.5 text-xs font-medium text-danger-500"
                >
                  <LogOut className="h-3.5 w-3.5" /> Log out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}