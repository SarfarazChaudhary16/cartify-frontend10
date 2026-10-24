import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * Full-screen overlay — logout, login, aur signup teenон jagah reuse
 * hota hai, bas "message" prop se text badalta hai. Purpose same hai:
 * user ko clear visual-feedback dena jab tak page-transition (navigate)
 * complete na ho jaye, taaki koi "wrong page flash" na dikhe.
 */
export function LogoutOverlay({ message = 'Signing you out…' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-porcelain-100/95 backdrop-blur-sm dark:bg-ink-950/95"
    >
      <Loader2 className="h-8 w-8 animate-spin text-cobalt-500" />
      <p className="text-sm font-medium text-ink-600 dark:text-porcelain-300/70">{message}</p>
    </motion.div>
  )
}