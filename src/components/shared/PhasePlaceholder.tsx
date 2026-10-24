interface PhasePlaceholderProps { pageName: string; phase: string }
export default function PhasePlaceholder({ pageName, phase }: PhasePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-cobalt-500">{phase}</span>
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">{pageName}</h1>
      <p className="max-w-sm text-sm text-ink-600 dark:text-porcelain-300/70">
        This page is scaffolded and routed. Its full UI arrives when we build {phase.toLowerCase()}.
      </p>
    </div>
  )
}
