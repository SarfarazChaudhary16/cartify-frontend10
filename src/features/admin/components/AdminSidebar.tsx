import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/layout/header/Logo'
import { adminNavItems } from '@/lib/adminNav'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-ink-950 lg:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Logo className="[&_span]:text-white [&_span]:opacity-100" />
        <span className="ml-2 rounded-md bg-cobalt-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cobalt-400">
          Admin
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-cobalt-500/15 text-cobalt-400' : 'text-porcelain-300/70 hover:bg-white/5 hover:text-porcelain-100',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}