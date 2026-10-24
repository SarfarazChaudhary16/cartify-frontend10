import { useRef, useState, type FormEvent, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/useAuthStore'
import { apiClient } from '@/lib/apiClient'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const refreshUser = useAuthStore((s) => s.refreshUser)
  const { toast } = useToast()

  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Image ko upload se PEHLE browser mein hi chhota (resize) karta hai —
  // phone-camera se aayi 5-8 MB photo ko ~200-400 KB tak la ke aata hai,
  // isse upload MUCH FASTER hoti hai (chhoti file, kam data bhejna padta hai)
  function resizeImage(file: File, maxDimension = 500): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))), 'image/jpeg', 0.8)
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // ===== INSTANT PREVIEW — turant dikha dete hain, background mein
    // asal upload chalta rahega =====
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    setUploadingAvatar(true)
    try {
      const compressedBlob = await resizeImage(file)

      const formData = new FormData()
      formData.append('file', compressedBlob, file.name)

      await apiClient.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      await refreshUser()
      toast({ type: 'success', title: 'Profile photo updated' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to upload photo', description: err.response?.data?.message })
    } finally {
      setUploadingAvatar(false)
      setPreviewUrl(null)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
    if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) nextErrors.phone = 'Enter a valid phone number.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await apiClient.put('/users/me', {
        name: form.name,
        phone: form.phone,
        avatar: user?.avatar,
      })
      toast({ type: 'success', title: 'Profile updated', description: 'Your changes have been saved.' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update profile', description: err.response?.data?.message })
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Profile</h1>
      <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">Manage your personal information.</p>

      <div className="surface-card mt-6 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={previewUrl ?? user.avatar} name={user.name} size="lg" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              aria-label="Change photo"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-cobalt-500 text-white shadow-sm"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{user.name}</p>
            {/* NAYA: Agar createdAt missing/invalid hai (jaise koi purana
                account jisme ye field null tha), to poori line hi chhupa
                dete hain — "January 1970" jaisa galat-info dikhane se
                behtar hai kuch na dikhana */}
            {user.createdAt && !isNaN(new Date(user.createdAt).getTime()) && (
              <p className="text-xs text-ink-600 dark:text-porcelain-300/60">
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="Email" type="email" value={user.email} disabled />
          <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
          <div className="flex items-end sm:col-span-2">
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}