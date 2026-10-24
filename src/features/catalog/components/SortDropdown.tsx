import { ArrowUpDown, Check } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownPanel, DropdownItem } from '@/components/ui/Dropdown'
import { sortOptions } from '@/lib/filterProducts'
import type { SortOption } from '@/types'
import { cn } from '@/lib/utils'

export function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const current = sortOptions.find((o) => o.value === value)

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="flex h-10 items-center gap-2 rounded-xl border border-porcelain-300 bg-white px-3.5 text-sm font-medium text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100">
          <ArrowUpDown className="h-3.5 w-3.5" />
          {current?.label}
        </button>
      </DropdownTrigger>
      <DropdownPanel align="end" className="w-52">
        {sortOptions.map((opt) => (
          <DropdownItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn('justify-between', opt.value === value ? 'text-cobalt-600 dark:text-cobalt-400' : undefined)}
          >
            <span>{opt.label}</span>
            {opt.value === value && <Check className="h-4 w-4" />}
          </DropdownItem>
        ))}
      </DropdownPanel>
    </Dropdown>
  )
}