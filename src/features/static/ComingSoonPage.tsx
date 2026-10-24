import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ComingSoonPage() {
  const target = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), [])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-500">
        <Sparkles className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">Something new is coming</h1>
      <p className="mt-2 text-sm text-ink-600 dark:text-porcelain-300/70">We're putting the finishing touches on this. Check back soon.</p>

      <CountdownTimer target={target} className="mt-6" />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 rounded-xl bg-success-500/10 px-4 py-3 text-sm font-medium text-success-500"
          >
            <CheckCircle2 className="h-4 w-4" /> We'll notify you when it's live.
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="mt-6 flex w-full max-w-sm gap-2">
            <div className="flex-1">
              <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} aria-label="Email address" />
            </div>
            <Button type="submit" className="shrink-0">Notify Me</Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}