import { create } from 'zustand'

interface ChatUIState {
  open: boolean
  minimized: boolean
  fullScreen: boolean
  openChat: () => void
  closeChat: () => void
  toggleMinimize: () => void
  toggleFullScreen: () => void
}

/** Chat window open/minimized/full-screen state — separate from message history so other pages (e.g. Help Center) can trigger the widget open. */
export const useChatUIStore = create<ChatUIState>((set, get) => ({
  open: false,
  minimized: false,
  fullScreen: false,
  openChat: () => set({ open: true, minimized: false }),
  closeChat: () => set({ open: false, fullScreen: false }),
  toggleMinimize: () => set({ minimized: !get().minimized }),
  toggleFullScreen: () => set({ fullScreen: !get().fullScreen }),
}))