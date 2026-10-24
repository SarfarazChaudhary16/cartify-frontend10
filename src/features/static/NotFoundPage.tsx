import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-cobalt-500/10 text-cobalt-500"
      >
        <Compass className="h-9 w-9" />
      </motion.span>
      <p className="price mt-6 font-display text-6xl font-semibold text-ink-950 dark:text-porcelain-100">404</p>
      <h1 className="mt-2 font-display text-xl font-medium text-ink-950 dark:text-porcelain-100">Page not found</h1>
      <p className="mt-2 text-sm text-ink-600 dark:text-porcelain-300/70">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/">
          <Button leftIcon={<Home className="h-4 w-4" />}>Back to Home</Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" leftIcon={<Search className="h-4 w-4" />}>Browse Products</Button>
        </Link>
      </div>
    </div>
  )
}