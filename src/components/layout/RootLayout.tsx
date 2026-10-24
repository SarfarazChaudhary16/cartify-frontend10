import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/header/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
// import { FloatingChatWidget } from '@/features/chat/FloatingChatWidget'
import { TopLoadingBar } from '@/components/ui/TopLoadingBar'
import { useAdminSettingsStore } from '@/store/useAdminSettingsStore'
import { useAuthStore } from '@/store/useAuthStore'
import MaintenancePage from '@/features/static/MaintenancePage'

export default function RootLayout() {
  const maintenanceMode = useAdminSettingsStore((s) => s.maintenanceMode)
  const fetchSettings = useAdminSettingsStore((s) => s.fetchSettings)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [settingsChecked, setSettingsChecked] = useState(false)

  // NAYA: Auth-store ke "rehydration" (localStorage se purana user
  // wapas load karne) ka bhi wait karte hain — Zustand ka persist()
  // middleware ye process THODA async karta hai. Pehle humara code
  // isko IGNORE kar raha tha, isliye ek RACE-CONDITION ban gaya tha:
  // agar fetchSettings() PEHLE complete ho jaye, aur user abhi tak
  // "null" hi ho (rehydration complete NAHI hua), to Admin ko bhi
  // GALTI se "not admin" samajh ke block kar diya jata tha.
  const [authRehydrated, setAuthRehydrated] = useState(false)

  useEffect(() => {
    // persist.hasHydrated() Zustand ka built-in check hai — batata hai
    // "kya localStorage se purana state WAPAS load ho chuka hai ya nahi"
    if (useAuthStore.persist.hasHydrated()) {
      setAuthRehydrated(true)
    } else {
      // Agar abhi tak nahi hua, to "onFinishHydration" callback lagate
      // hain — jaise hi rehydration complete ho, hume pata chal jaye
      const unsub = useAuthStore.persist.onFinishHydration(() => setAuthRehydrated(true))
      return unsub
    }
  }, [])

  useEffect(() => {
    fetchSettings().finally(() => setSettingsChecked(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // NAYA: Ab HAMESHA dono cheezein (settings + auth-rehydration) ka
  // wait karte hain, TABHI decide karte hain "maintenance dikhana hai
  // ya nahi" — isse race-condition poori tarah khatam ho jati hai
  const readyToCheck = settingsChecked && authRehydrated

  if (readyToCheck && maintenanceMode && (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="flex min-h-screen flex-col bg-porcelain-100 dark:bg-ink-950">
        <MaintenancePage />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-porcelain-100 dark:bg-ink-950">
      <TopLoadingBar />
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* <FloatingChatWidget /> */}
    </div>
  )
}