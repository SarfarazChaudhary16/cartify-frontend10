import { Link } from 'react-router-dom'

/** Cartify wordmark. The dot over the "i" doubles as a nod to a cart's single price point. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={className} aria-label="Cartify — home">
      <span className="font-display text-2xl font-semibold tracking-tight text-ink-950 dark:text-porcelain-100">
        Cart<span className="text-cobalt-500">i</span>fy
      </span>
    </Link>
  )
}