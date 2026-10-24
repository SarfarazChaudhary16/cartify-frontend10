import { useState } from 'react'
import { Briefcase, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { jobOpenings } from '@/mocks/jobs'

const departments = ['All', ...Array.from(new Set(jobOpenings.map((j) => j.department)))]

export default function CareersPage() {
  const [department, setDepartment] = useState('All')
  const { toast } = useToast()

  const filtered = department === 'All' ? jobOpenings : jobOpenings.filter((j) => j.department === department)

  return (
    <div>
      <div className="bg-ink-950 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-gold-400">Careers</p>
          <h1 className="mt-3 font-display text-3xl font-medium text-porcelain-100 sm:text-4xl">Help us build honest ecommerce</h1>
          <p className="mt-4 text-sm text-porcelain-300/70">We're a small, fast-moving team based in Pune, working remote-friendly.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-1.5">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDepartment(d)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                department === d
                  ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950'
                  : 'bg-porcelain-200 text-ink-700 hover:bg-porcelain-300 dark:bg-ink-800 dark:text-porcelain-200 dark:hover:bg-ink-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map((job) => (
            <div key={job.id} className="surface-card surface-card-lift flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">{job.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-ink-600 dark:text-porcelain-300/60">
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                  <Badge variant="cobalt">{job.type}</Badge>
                </div>
              </div>
              <a href="mailto:careers@cartify.example?subject=Application">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast({ type: 'info', title: 'Opening email client…', description: `Applying for ${job.title}` })}
                >
                  Apply
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}