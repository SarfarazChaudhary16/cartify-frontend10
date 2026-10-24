import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  viewAllHref?: string
  className?: string
}

/** Consistent "eyebrow / title / view all" header used above every home-page product rail. */
export function SectionHeader({ eyebrow, title, description, viewAllHref, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && (
          <p className="mb-1.5 font-mono text-xs font-medium uppercase tracking-widest text-cobalt-500">{eyebrow}</p>
        )}
        <h2 className="font-display text-2xl font-medium text-ink-950 sm:text-3xl dark:text-porcelain-100">{title}</h2>
        {description && <p className="mt-1.5 max-w-xl text-sm text-ink-600 dark:text-porcelain-300/70">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-cobalt-600 dark:text-cobalt-400"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}