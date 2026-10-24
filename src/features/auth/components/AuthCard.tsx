import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/layout/header/Logo'
import { cn } from '@/lib/utils'

export function AuthCard({ title, subtitle, children, wide }: { title: string; subtitle?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('mx-auto flex flex-col justify-center px-4 py-10 sm:px-0', wide ? 'max-w-lg' : 'max-w-md')}>
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="surface-card p-7"
      >
        <h1 className="font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-600 dark:text-porcelain-300/70">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  )
}