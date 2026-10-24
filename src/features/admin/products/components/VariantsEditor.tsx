import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Product, ProductVariant } from '@/types'

type Colors = NonNullable<Product['colors']>
type Sizes = NonNullable<Product['sizes']>
type Specs = Product['specifications']

export function ColorsEditor({ colors, onChange }: { colors: Colors; onChange: (colors: Colors) => void }) {
  const [name, setName] = useState('')
  const [hex, setHex] = useState('#3454FF')

  function add() {
    if (!name.trim()) return
    onChange([...colors, { name: name.trim(), hex }])
    setName('')
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Colors</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {colors.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 rounded-full border border-porcelain-300 py-1 pl-1 pr-2 text-xs dark:border-ink-700">
            <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
            {c.name}
            <button onClick={() => onChange(colors.filter((_, idx) => idx !== i))} aria-label="Remove color">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-porcelain-300 dark:border-ink-700" />
        <div className="flex-1">
          <Input placeholder="Color name (e.g. Cobalt)" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        </div>
        <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={add}>Add</Button>
      </div>
    </div>
  )
}

export function SizesEditor({ sizes, onChange }: { sizes: Sizes; onChange: (sizes: Sizes) => void }) {
  const [value, setValue] = useState('')

  function add() {
    if (!value.trim()) return
    onChange([...sizes, value.trim()])
    setValue('')
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Sizes</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {sizes.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5 rounded-lg border border-porcelain-300 px-2.5 py-1 text-xs dark:border-ink-700">
            {s}
            <button onClick={() => onChange(sizes.filter((_, idx) => idx !== i))} aria-label="Remove size">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input placeholder="e.g. UK 9, M, XL…" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        </div>
        <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={add}>Add</Button>
      </div>
    </div>
  )
}

export function SpecificationsEditor({ specs, onChange }: { specs: Specs; onChange: (specs: Specs) => void }) {
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')

  function add() {
    if (!label.trim() || !value.trim()) return
    onChange([...specs, { label: label.trim(), value: value.trim() }])
    setLabel('')
    setValue('')
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Specifications</p>
      <div className="mb-3 space-y-1.5">
        {specs.map((s, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-porcelain-100 px-3 py-2 text-xs dark:bg-ink-800">
            <span><span className="font-medium text-ink-950 dark:text-porcelain-100">{s.label}:</span> {s.value}</span>
            <button onClick={() => onChange(specs.filter((_, idx) => idx !== i))} aria-label="Remove spec">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="w-1/3">
          <Input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="flex-1">
          <Input placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        </div>
        <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={add}>Add</Button>
      </div>
    </div>
  )
}

export function VariantsTableEditor({ variants, colors, sizes, onChange }: { variants: ProductVariant[]; colors: Colors; sizes: Sizes; onChange: (variants: ProductVariant[]) => void }) {
  function addRow() {
    onChange([...variants, { id: `var-${Date.now()}`, color: colors[0]?.name, size: sizes[0], sku: '', stock: 0 }])
  }

  function updateRow(index: number, patch: Partial<ProductVariant>) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }

  function removeRow(index: number) {
    onChange(variants.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-ink-950 dark:text-porcelain-100">Variants (SKU / Stock per combination)</p>
        <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={addRow}>Add Row</Button>
      </div>
      {variants.length === 0 ? (
        <p className="text-xs text-ink-600 dark:text-porcelain-300/50">No variants yet — add colors/sizes above, then add variant rows here.</p>
      ) : (
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={v.id} className="grid grid-cols-[1fr_1fr_1fr_80px_32px] items-center gap-2">
              <select
                value={v.color ?? ''}
                onChange={(e) => updateRow(i, { color: e.target.value })}
                className="h-9 rounded-lg border border-porcelain-300 bg-white px-2 text-xs dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
              >
                {colors.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <select
                value={v.size ?? ''}
                onChange={(e) => updateRow(i, { size: e.target.value })}
                className="h-9 rounded-lg border border-porcelain-300 bg-white px-2 text-xs dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
              >
                {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateRow(i, { sku: e.target.value })}
                className="h-9 rounded-lg border border-porcelain-300 bg-white px-2 text-xs dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateRow(i, { stock: Number(e.target.value) })}
                className="h-9 rounded-lg border border-porcelain-300 bg-white px-2 text-xs dark:border-ink-700 dark:bg-ink-900 dark:text-porcelain-100"
              />
              <button onClick={() => removeRow(i)} aria-label="Remove variant" className="flex h-9 w-8 items-center justify-center text-ink-600 hover:text-danger-500 dark:text-porcelain-300/60">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}