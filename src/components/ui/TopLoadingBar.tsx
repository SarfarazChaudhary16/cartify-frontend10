import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLoadingStore } from '@/store/useLoadingStore'

const SHOW_DELAY_MS = 150   // itni der tak request chale, tabhi bar dikhाओ
const MIN_VISIBLE_MS = 400  // ek baar dikh jaye to, itni der tak zaroor rukो

export function TopLoadingBar() {
  const isLoading = useLoadingStore((s) => s.isLoading)
  const [visible, setVisible] = useState(false)

  const showTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const shownAtRef = useRef<number>(0)

  useEffect(() => {
    if (isLoading) {
      // Agar pehle se koi "hide" timer pending tha, cancel karo
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }

      // NAYA request shuru hui — 150ms wait karte hain, agar tab TAK
      // bhi loading chal rahi hai (matlab request genuinely slow hai),
      // TABHI bar dikhाते hain. Fast requests ke liye ye timer kabhi
      // fire hi nahi hoga (kyunki isLoading pehle hi false ho chuka hoga)
      if (!showTimerRef.current) {
        showTimerRef.current = window.setTimeout(() => {
          setVisible(true)
          shownAtRef.current = Date.now()
          showTimerRef.current = null
        }, SHOW_DELAY_MS)
      }
    } else {
      // Loading khatam ho gayi
      if (showTimerRef.current) {
        // Agar "show" timer abhi tak fire hi nahi hua tha (matlab
        // request itni FAST thi ki 150ms se pehle hi complete ho gayi),
        // to bar kabhi dikhाई hi nahi — bas timer cancel kar do, kuch
        // aur karne ki zarurat nahi
        window.clearTimeout(showTimerRef.current)
        showTimerRef.current = null
      }

      if (visible) {
        // Bar abhi VISIBLE hai — check karte hain kitni der se dikh
        // rahi hai. Agar MIN_VISIBLE_MS se kam waqt hua hai, to bacha
        // hua waqt wait karke hi hide karte hain (taaki flash na lage)
        const elapsed = Date.now() - shownAtRef.current
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed)
        hideTimerRef.current = window.setTimeout(() => {
          setVisible(false)
          hideTimerRef.current = null
        }, remaining)
      }
    }

    return () => {
      // Cleanup — agar component unmount ho jaye ya isLoading dobara
      // badle, purane timers cancel kar dete hain
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed left-0 top-0 z-[100] h-[3px] w-full overflow-hidden bg-transparent">
          <motion.div
            className="h-full bg-gradient-to-r from-cobalt-500 via-gold-500 to-cobalt-500"
            initial={{ width: '0%' }}
            animate={{ width: '90%' }}
            exit={{ width: '100%', opacity: 0 }}
            transition={{
              width: { duration: 8, ease: 'easeOut' },
              opacity: { duration: 0.3, delay: 0.15 },
            }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}