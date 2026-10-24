import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

interface BackendSettings {
  storeName: string
  supportEmail: string
  maintenanceMode: boolean
}

interface AdminSettingsState {
  storeName: string
  supportEmail: string
  maintenanceMode: boolean
  loading: boolean

  fetchSettings: () => Promise<void>
  update: (patch: { storeName: string; supportEmail: string; maintenanceMode: boolean }) => Promise<void>
}

/**
 * Store Settings — ab REAL backend (/api/store-settings) se juda hai.
 * Ye ek GLOBAL/singleton setting hai — koi bhi Admin update kare,
 * SABHI ko (Admins aur customers dono) wahi latest values dikhengi.
 * GET endpoint PUBLIC hai (koi bhi visitor maintenance-mode check kar
 * sake, RootLayout mount hote hi), PUT sirf ADMIN kar sakta hai.
 */
export const useAdminSettingsStore = create<AdminSettingsState>((set) => ({
  storeName: 'Cartify',
  supportEmail: 'support@cartify.example',
  maintenanceMode: false,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendSettings>('/store-settings')
    set({ ...response.data, loading: false })
  },

  update: async (patch) => {
    const response = await apiClient.put<BackendSettings>('/store-settings/admin', patch)
    set(response.data)
  },
}))