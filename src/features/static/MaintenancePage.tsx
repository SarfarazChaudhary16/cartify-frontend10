import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <motion.span
        animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400"
      >
        <Wrench className="h-9 w-9" />
      </motion.span>
      <h1 className="mt-6 font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">We'll be right back</h1>
      <p className="mt-2 text-sm text-ink-600 dark:text-porcelain-300/70">
        Cartify is undergoing scheduled maintenance to make things faster. Please check back shortly.
      </p>
    </div>
  )
}