import type { ReactNode } from 'react'

export function ContactOptionCard({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <div className="surface-card surface-card-lift flex flex-col items-start gap-3 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-500">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">{title}</p>
        <p className="mt-0.5 text-sm text-ink-600 dark:text-porcelain-300/70">{description}</p>
      </div>
      {action}
    </div>
  )
}