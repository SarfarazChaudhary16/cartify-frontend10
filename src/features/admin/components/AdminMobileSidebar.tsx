import { NavLink } from 'react-router-dom'
import { Drawer } from '@/components/ui/Drawer'
import { adminNavItems } from '@/lib/adminNav'
import { cn } from '@/lib/utils'

export function AdminMobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Cartify Admin" widthClassName="max-w-xs">
      <nav className="-mx-1 space-y-0.5">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-cobalt-500/10 text-cobalt-600 dark:text-cobalt-400' : 'text-ink-700 hover:bg-porcelain-100 dark:text-porcelain-200 dark:hover:bg-ink-800',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </Drawer>
  )
}