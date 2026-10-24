import { useState } from 'react'
import { Plus, X, Video } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ProductImage } from '@/types'

export function ImagesManager({ images, onChange }: { images: ProductImage[]; onChange: (images: ProductImage[]) => void }) {
  const [url, setUrl] = useState('')
  const [videoFileName, setVideoFileName] = useState<string | null>(null)

  function addImage() {
    if (!url.trim()) return
    onChange([...images, { id: `img-${Date.now()}`, url: url.trim(), alt: 'Product image' }])
    setUrl('')
  }

  function removeImage(id: string) {
    onChange(images.filter((i) => i.id !== id))
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Product Images</p>
      <div className="flex flex-wrap gap-2.5">
        {images.map((img) => (
          <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-lg">
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            <button
              onClick={() => removeImage(img.id)}
              aria-label="Remove image"
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-950/70 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex-1">
          <Input placeholder="Paste an image URL…" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addImage()} />
        </div>
        <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addImage}>Add</Button>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-ink-950 dark:text-porcelain-100">Product Video (optional)</p>
        {videoFileName ? (
          <div className="flex items-center gap-2 rounded-lg bg-porcelain-100 px-3 py-2 text-sm text-ink-700 dark:bg-ink-800 dark:text-porcelain-200">
            <Video className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{videoFileName}</span>
            <button onClick={() => setVideoFileName(null)} aria-label="Remove video">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-porcelain-300 px-4 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:border-cobalt-500 hover:text-cobalt-600 dark:border-ink-700 dark:text-porcelain-300/60">
            <Video className="h-4 w-4" /> Upload a product video
            <input type="file" accept="video/*" hidden onChange={(e) => setVideoFileName(e.target.files?.[0]?.name ?? null)} />
          </label>
        )}
        <p className="mt-1.5 text-xs text-ink-600 dark:text-porcelain-300/50">Video upload is a UI preview — playback support is on our backend roadmap.</p>
      </div>
    </div>
  )
}