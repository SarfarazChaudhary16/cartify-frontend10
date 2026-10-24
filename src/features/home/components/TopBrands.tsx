import { Link } from 'react-router-dom'
import { brands } from '@/mocks/brands'
import { SectionHeader } from '@/components/shared/SectionHeader'

/** Brand shortcut strip — logo + name, links into brand-filtered catalog. */
export function TopBrands() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Trusted" title="Top Brands" className="mb-6" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            to={`/brand/${b.slug}`}
            className="surface-card surface-card-lift flex flex-col items-center gap-3 p-5 text-center"
          >
            <img src={b.logo} alt={b.name} className="h-12 w-12 rounded-full" />
            <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">{b.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}