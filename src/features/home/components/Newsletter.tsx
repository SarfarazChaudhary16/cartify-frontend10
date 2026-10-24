import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Status = 'idle' | 'loading' | 'success' | 'error'

/** Email signup with real validation + loading + success states (mock submit). */
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      setStatus('error')
      return
    }
    setError('')
    setStatus('loading')
    window.setTimeout(() => setStatus('success'), 900)
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="surface-card relative overflow-hidden px-6 py-10 text-center sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cobalt-500/[0.06] via-transparent to-transparent" />
        <div className="relative">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cobalt-500/10 text-cobalt-500">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="font-display text-2xl font-medium text-ink-950 sm:text-3xl dark:text-porcelain-100">
            Get early access to drops and sales
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-600 dark:text-porcelain-300/70">
            One email a week. New arrivals, flash sales, and nothing else.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-xl bg-success-500/10 px-4 py-3 text-sm font-medium text-success-500"
              >
                <CheckCircle2 className="h-4 w-4" />
                You're on the list — check your inbox.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleSubmit}
                className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-start"
              >
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === 'error') setStatus('idle')
                    }}
                    error={status === 'error' ? error : undefined}
                    aria-label="Email address"
                  />
                </div>
                <Button type="submit" loading={status === 'loading'} className="sm:shrink-0">
                  Subscribe
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}