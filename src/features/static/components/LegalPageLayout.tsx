import { formatDate } from '@/lib/utils'
import type { LegalDoc } from '@/mocks/legalContent'

export function LegalPageLayout({ title, doc }: { title: string; doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-medium text-ink-950 dark:text-porcelain-100">{title}</h1>
      <p className="mt-1.5 text-xs text-ink-600 dark:text-porcelain-300/50">Last updated {formatDate(doc.lastUpdated)}</p>
      <p className="mt-5 text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{doc.intro}</p>

      <div className="mt-8 space-y-8">
        {doc.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-2 text-lg font-semibold text-ink-950 dark:text-porcelain-100">{s.heading}</h2>
            <p className="text-sm leading-relaxed text-ink-600 dark:text-porcelain-300/70">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}