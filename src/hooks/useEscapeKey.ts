import { useEffect } from 'react'

/** Calls `handler` when Escape is pressed. Used by Modal, Drawer, Dropdown. */
export function useEscapeKey(handler: () => void, active = true) {
  useEffect(() => {
    if (!active) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handler()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handler, active])
}