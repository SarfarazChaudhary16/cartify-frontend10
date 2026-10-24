import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { useToast } from '@/components/ui/Toast'
import { useAdminSettingsStore } from '@/store/useAdminSettingsStore'
import { useAuthStore } from '@/store/useAuthStore'

export default function AdminSettingsPage() {
  const admin = useAuthStore((s) => s.user)
  const storeName = useAdminSettingsStore((s) => s.storeName)
  const supportEmail = useAdminSettingsStore((s) => s.supportEmail)
  const maintenanceMode = useAdminSettingsStore((s) => s.maintenanceMode)
  const fetchSettings = useAdminSettingsStore((s) => s.fetchSettings)
  const update = useAdminSettingsStore((s) => s.update)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [form, setForm] = useState({ storeName, supportEmail, maintenanceMode })
  const [saving, setSaving] = useState(false)

  // NAYA: Jab backend se fresh settings aayen (fetchSettings complete
  // hone ke baad), form ko unse SYNC karte hain — warna form hamesha
  // initial-empty-values pe atka rehta (kyunki useState sirf PEHLI baar
  // component-mount pe initial-value leta hai, baad mein store-changes
  // se khud-ba-khud sync nahi hota)
  useEffect(() => {
    setForm({ storeName, supportEmail, maintenanceMode })
  }, [storeName, supportEmail, maintenanceMode])

  async function handleSave() {
    setSaving(true)
    try {
      await update(form)
      toast({ type: 'success', title: 'Settings saved' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to save', description: err.response?.data?.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">Settings</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Store configuration and admin profile.</p>

      <div className="surface-card mt-6 p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Admin Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Name" value={admin?.name ?? ''} disabled />
          <Input label="Email" value={admin?.email ?? ''} disabled />
          <Input label="Role" value={admin?.role ?? ''} disabled />
        </div>
      </div>

      <div className="surface-card mt-6 p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink-950 dark:text-porcelain-100">Store Configuration</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Store Name" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
          <Input label="Support Email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-porcelain-300 pt-5 dark:border-ink-700">
          <div>
            <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">Maintenance Mode</p>
            <p className="text-xs text-ink-600 dark:text-porcelain-300/60">Shows the "Under Maintenance" page to customers.</p>
          </div>
          <Switch checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} loading={saving}>Save Settings</Button>
      </div>
    </div>
  )
}