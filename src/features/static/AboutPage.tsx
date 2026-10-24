import { motion } from 'framer-motion'
import { ShieldCheck, Truck, Heart, Sparkles } from 'lucide-react'

const stats = [
  { label: 'Products curated', value: '12,000+' },
  { label: 'Cities served', value: '450+' },
  { label: 'Brands partnered', value: '80+' },
  { label: 'Customer rating', value: '4.6/5' },
]

const values = [
  { icon: ShieldCheck, title: 'Quality first', description: 'Every brand is vetted before it reaches our catalog — no exceptions.' },
  { icon: Truck, title: 'Fast, honest delivery', description: 'Real delivery estimates, no surprise delays, live tracking on every order.' },
  { icon: Heart, title: 'Customer-obsessed', description: 'Returns, refunds, and support are designed to be fast and fair.' },
  { icon: Sparkles, title: 'Always improving', description: 'We ship small improvements to the shopping experience every week.' },
]

export default function AboutPage() {
  return (
    <div>
      <div className="bg-ink-950 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-gold-400">Our Story</p>
          <h1 className="mt-3 font-display text-3xl font-medium text-porcelain-100 sm:text-4xl">
            Ecommerce, reimagined for honesty
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-porcelain-300/70">
            Cartify started with a simple frustration: too many ecommerce sites bury real prices under fake discounts
            and ship whatever\u2019s cheapest to source. We built Cartify to be the opposite — curated products, honest
            pricing, and delivery estimates you can actually trust.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="surface-card p-5 text-center"
            >
              <p className="price font-display text-2xl font-semibold text-ink-950 dark:text-porcelain-100">{s.value}</p>
              <p className="mt-1 text-xs text-ink-600 dark:text-porcelain-300/60">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-center font-display text-2xl font-medium text-ink-950 dark:text-porcelain-100">What we stand for</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="surface-card flex gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cobalt-500/10 text-cobalt-500">
                  <v.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-950 dark:text-porcelain-100">{v.title}</p>
                  <p className="mt-1 text-sm text-ink-600 dark:text-porcelain-300/70">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}