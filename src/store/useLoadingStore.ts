import { create } from 'zustand'

interface LoadingState {
  activeRequests: number
  isLoading: boolean
  startRequest: () => void
  endRequest: () => void
}

/**
 * Global loading-tracker — poori app mein jitni bhi API-calls EK SAATH
 * chal rahi hain, unka COUNT rakhta hai. "isLoading" tabhi TRUE hoga
 * jab kam-se-kam EK request chal rahi ho — jaise hi SAARI complete ho
 * jayen (count wapas 0 ho jaye), loader gayab ho jata hai.
 *
 * Counter (sirf boolean nahi) isliye use kar rahe hain kyunki agar EK
 * saath 3 API-calls chal rahi hon, aur EK complete ho jaye, to loader
 * turant gayab NAHI hona chahiye — baaki 2 abhi bhi chal rahi hain.
 */
export const useLoadingStore = create<LoadingState>((set, get) => ({
  activeRequests: 0,
  isLoading: false,

  startRequest: () => {
    const next = get().activeRequests + 1
    set({ activeRequests: next, isLoading: true })
  },

  endRequest: () => {
    const next = Math.max(0, get().activeRequests - 1)
    set({ activeRequests: next, isLoading: next > 0 })
  },
}))