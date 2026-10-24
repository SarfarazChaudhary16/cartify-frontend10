import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

// Backend AdminUserResponse ka raw shape
interface BackendAdminUser {
  id: number
  name: string
  email: string
  phone?: string
  joinedAt: string
  ordersCount: number
  totalSpent: number
  blocked: boolean
}

// Frontend ke component (AdminUsersPage.tsx) ko jo shape chahiye —
// "status: 'active'|'blocked'" (jaisa mock mein tha), backend ka
// "blocked: boolean" ise convert karke banate hain
export interface AdminUserRecord {
  id: string
  name: string
  email: string
  joinedAt: string
  ordersCount: number
  totalSpent: number
  status: 'active' | 'blocked'
}

function mapBackendUser(u: BackendAdminUser): AdminUserRecord {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    joinedAt: u.joinedAt,
    ordersCount: u.ordersCount,
    totalSpent: u.totalSpent,
    status: u.blocked ? 'blocked' : 'active',
  }
}

interface AdminUsersState {
  users: AdminUserRecord[]
  loading: boolean
  fetchUsers: () => Promise<void>
  toggleBlock: (id: string) => Promise<void>
}

/**
 * Admin Users page — ab REAL backend (/api/admin/users) se juda hai.
 * Yehi wajah thi naye signup-kiye users na dikhne ki — is store ko
 * abhi tak kabhi wire hi nahi kiya gaya tha is conversation mein.
 */
export const useAdminUsersStore = create<AdminUsersState>((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendAdminUser[]>('/admin/users')
    set({ users: response.data.map(mapBackendUser), loading: false })
  },

  toggleBlock: async (id) => {
    const response = await apiClient.put<BackendAdminUser>(`/admin/users/${id}/toggle-block`)
    const updated = mapBackendUser(response.data)
    set((state) => ({ users: state.users.map((u) => (u.id === id ? updated : u)) }))
  },
}))