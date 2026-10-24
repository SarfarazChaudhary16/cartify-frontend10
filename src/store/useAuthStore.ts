import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '@/lib/apiClient'
import type { User } from '@/types'

// Backend jo User-shape bhejta hai (Java ke UserResponse DTO se match karta hai).
// Dhyan do: "role" yahan UPPERCASE hai ("CUSTOMER"/"ADMIN") kyunki wo Java
// Enum.name() se aata hai, aur "id" ek NUMBER hai (Long). Frontend ke
// baaki poore app mein IDs hamesha STRING treat hoti hain (jaise mock-data
// mein "u-1" jaisi thi), isliye humein CONVERT karna padega.
interface BackendUser {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
}

interface LoginResponseData {
  token: string
  user: BackendUser
}

// Backend ke "raw" user-shape ko frontend ke apne User type mein convert
// karta hai — id ko String() se string banate hain, aur role ko
// lowercase mein convert karte hain ("ADMIN" -> "admin"), taaki poora
// baaki frontend (jo "role === 'admin'" jaisa check karta hai) bina
// kisi change ke kaam karta rahe.
function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: String(backendUser.id),
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: backendUser.avatar,
    createdAt: backendUser.createdAt,
    role: backendUser.role === 'ADMIN' ? 'admin' : 'customer',
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean

 login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string; role?: User['role'] }>
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string }>
  logout: () => void
  refreshUser: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>
  verifyPasswordResetOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; message: string }>
  resendOtp: (email: string, purpose: string) => Promise<{ success: boolean; message: string }>
}

/**
 * Ab ye store MOCK data use nahi karta — har method REAL backend
 * (/api/auth/**) ko call karta hai apiClient (axios instance) ke through.
 * JWT token ko localStorage mein "cartify_token" key se save karte hain —
 * apiClient ka interceptor (Step 1 mein banaya tha) ise automatically
 * har agli request ke Authorization header mein bhej dega.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // ===================================================================
      // LOGIN
      // ===================================================================
      login: async (email, password, rememberMe = true) => {
        try {
          const response = await apiClient.post<LoginResponseData>('/auth/login', { email, password })
          const { token, user } = response.data

          // NAYA: "Remember me" checked hai to localStorage mein
          // (browser band karke bhi persist rahega, jab tak JWT khud
          // expire na ho ya logout na ho) — unchecked hai to
          // sessionStorage mein (sirf isi tab/window ke liye, band
          // hote hi automatically gayab ho jayega)
          if (rememberMe) {
            localStorage.setItem('cartify_token', token)
          } else {
            sessionStorage.setItem('cartify_token', token)
          }

          const mappedUser = mapBackendUser(user)
          set({ user: mappedUser, isAuthenticated: true })

          return { success: true, message: 'Welcome back!', role: mappedUser.role }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Incorrect email or password.'
          return { success: false, message }
        }
      },

      // ===================================================================
      // SIGNUP
      // ===================================================================
      signup: async (data) => {
        try {
          const response = await apiClient.post('/auth/register', data)
          return { success: true, message: response.data.message }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Something went wrong. Please try again.'
          return { success: false, message }
        }
      },

      // ===================================================================
      // LOGOUT
      // ===================================================================
      logout: () => {
        // NAYA: Token dono jagah se hatate hain — pata nahi tha
        // "remember me" check kiya gaya tha ya nahi, isliye SAFELY
        // dono ko clear kar dete hain (jo nahi hai wo already khaali hai)
        localStorage.removeItem('cartify_token')
        sessionStorage.removeItem('cartify_token')
        set({ user: null, isAuthenticated: false })

        import('./useCartStore').then((m) => m.useCartStore.getState().resetLocal())
        import('./useWishlistStore').then((m) => m.useWishlistStore.getState().resetLocal())
        import('./useNotificationsStore').then((m) => m.useNotificationsStore.getState().resetLocal())
        import('./useOrdersStore').then((m) => m.useOrdersStore.getState().resetLocal())
        import('./useAddressesStore').then((m) => m.useAddressesStore.getState().resetLocal())
        import('./useReviewsStore').then((m) => m.useReviewsStore.getState().resetLocal())
        import('./useSupportTicketsStore').then((m) => m.useSupportTicketsStore.getState().resetLocal())
      },

      // ===================================================================
      // REFRESH USER — backend se fresh user-data mangwाता hai
      // ===================================================================
      // Jab bhi profile/avatar update ho (jaise ProfilePage se), poora
      // page-reload karne ke bajaye, sirf ye function call karenge —
      // localStorage-cached "user" turant refresh ho jata hai, bina
      // hard-reload ke.
      refreshUser: async () => {
        const response = await apiClient.get<BackendUser>('/users/me')
        const mappedUser = mapBackendUser(response.data)
        set({ user: mappedUser })
      },

      // ===================================================================
      // FORGOT PASSWORD — Step 1 (email se OTP maangna)
      // ===================================================================
      requestPasswordReset: async (email) => {
        try {
          const response = await apiClient.post('/auth/forgot-password', { email })
          return { success: true, message: response.data.message }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Something went wrong.'
          return { success: false, message }
        }
      },

      // ===================================================================
      // FORGOT PASSWORD — Step 2 (OTP verify karna)
      // ===================================================================
      verifyPasswordResetOtp: async (email, code) => {
        try {
          const response = await apiClient.post('/auth/verify-reset-otp', { email, code })
          return { success: true, message: response.data.message }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Incorrect code. Please try again.'
          return { success: false, message }
        }
      },

      // ===================================================================
      // FORGOT PASSWORD — Step 3 (naya password set karna)
      // ===================================================================
      resetPassword: async (email, newPassword) => {
        try {
          const response = await apiClient.post('/auth/reset-password', { email, newPassword })
          return { success: true, message: response.data.message }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Something went wrong.'
          return { success: false, message }
        }
      },

      // ===================================================================
      // SIGNUP OTP VERIFY — auto-login hone ke saath
      // ===================================================================
      verifyOtp: async (email, code) => {
        try {
          const response = await apiClient.post<LoginResponseData>('/auth/verify-signup-otp', { email, code })
          const { token, user } = response.data

          localStorage.setItem('cartify_token', token)
          const mappedUser = mapBackendUser(user)
          set({ user: mappedUser, isAuthenticated: true })

          return { success: true, message: 'Verified! Welcome to Cartify.' }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Incorrect code. Please try again.'
          return { success: false, message }
        }
      },

      // ===================================================================
      // RESEND OTP
      // ===================================================================
      resendOtp: async (email, purpose) => {
        try {
          const response = await apiClient.post(
            `/auth/resend-otp?email=${encodeURIComponent(email)}&purpose=${purpose}`,
          )
          return { success: true, message: response.data.message }
        } catch (error: any) {
          const message = error.response?.data?.message ?? 'Something went wrong.'
          return { success: false, message }
        }
      },
   }),
    {
      name: 'cartify-auth',
      // NAYA: Jab bhi app load ho aur Zustand localStorage se purana
      // state wapas la rahi ho, ye check karta hai — "kya isAuthenticated
      // TRUE bata raha hai, lekin ASAL token (localStorage/sessionStorage
      // dono mein) MISSING hai?" Agar haan (jaisa "remember me" UNCHECKED
      // wale case mein hota hai — browser band hote hi sessionStorage
      // token gayab ho jata hai, lekin persist wala isAuthenticated flag
      // localStorage mein reh jata tha), to FORCEFULLY logged-out state
      // set kar deta hai — taaki UI kabhi "fake logged-in" na dikhaye.
      onRehydrateStorage: () => (state) => {
        if (state) {
          const token = localStorage.getItem('cartify_token') || sessionStorage.getItem('cartify_token')
          if (!token) {
            state.user = null
            state.isAuthenticated = false
          }
        }
      },
    },
  ),
)