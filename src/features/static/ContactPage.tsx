import { useState, type FormEvent } from 'react'
import { Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/apiClient'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: Partial<typeof form> = {}
    if (!form.name.trim()) nextErrors.name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    if (!form.subject.trim()) nextErrors.subject = 'Required'
    if (form.message.trim().length < 10) nextErrors.message = 'Please write at least 10 characters'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      // NAYA: Real backend call — message database mein save hota hai,
      // aur user ko ek confirmation-email bhi jaati hai (backend
      // silently handle karta hai, koi extra frontend-logic nahi chahiye)
      await apiClient.post('/contact', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setErrors({ message: err.response?.data?.message ?? 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Contact Us</h1>
      <p className="mt-1.5 text-sm text-ink-600 dark:text-porcelain-300/70">We'd love to hear from you — general inquiries, partnerships, or feedback.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="surface-card p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-500/10 text-success-500">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <p className="mt-4 text-lg font-medium text-ink-950 dark:text-porcelain-100">Message sent</p>
                <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">We'll get back to you within 1-2 business days. Check your email for a confirmation.</p>
                <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
                <div className="sm:col-span-2">
                  <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={errors.subject} />
                </div>
                <div className="sm:col-span-2">
                  <Textarea label="Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="surface-card flex items-start gap-3 p-5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cobalt-500" />
            <div>
              <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Office</p>
              <p className="mt-0.5 text-sm text-ink-600 dark:text-porcelain-300/70">Cartify Technologies Pvt. Ltd.<br />Baner Road, Pune, Maharashtra 411045</p>
            </div>
          </div>
          <div className="surface-card flex items-start gap-3 p-5">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cobalt-500" />
            <div>
              <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Email</p>
              <p className="mt-0.5 text-sm text-ink-600 dark:text-porcelain-300/70">hello@cartify.example</p>
            </div>
          </div>
          <div className="surface-card flex items-start gap-3 p-5">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cobalt-500" />
            <div>
              <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">Phone</p>
              <p className="mt-0.5 text-sm text-ink-600 dark:text-porcelain-300/70">+91 12345 67890<br />Mon-Sat, 9am-7pm IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}