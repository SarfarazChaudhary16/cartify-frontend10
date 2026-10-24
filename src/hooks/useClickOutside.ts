import { useEffect, type RefObject } from 'react'

/** Calls `handler` when a pointer event happens outside `ref`. Used by Dropdown, Modal, Drawer. */
export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, handler: () => void, active = true) {
  useEffect(() => {
    if (!active) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [ref, handler, active])
}