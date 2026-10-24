import { useState } from 'react'
import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  src?: string
  name: string
  size?: Size
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

/** Avatar with graceful fallback to initials if the image fails or is absent. */
export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cobalt-500/10 font-semibold text-cobalt-600 dark:text-cobalt-400',
        sizeClasses[size],
        className,
      )}
    >
      {showImage ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        initials(name)
      )}
    </span>
  )
}