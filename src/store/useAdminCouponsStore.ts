import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

export interface AdminCoupon {
  code: string
  description: string
  discountType: 'flat' | 'percent'
  discountValue: number
  minOrderValue?: number
  expiresAt: string
  isActive: boolean
}

interface BackendCoupon {
  id: number
  code: string
  description: string
  discountType: string // "FLAT" | "PERCENT" (uppercase)
  discountValue: number
  minOrderValue?: number
  expiresAt: string
  active: boolean
}

function mapBackendCoupon(c: BackendCoupon): AdminCoupon {
  return {
    code: c.code,
    description: c.description,
    discountType: c.discountType.toLowerCase() as 'flat' | 'percent',
    discountValue: c.discountValue,
    minOrderValue: c.minOrderValue,
    expiresAt: c.expiresAt,
    isActive: c.active,
  }
}

interface AdminCouponsState {
  coupons: AdminCoupon[]
  // NAYA: backend ki asal (numeric) ID bhi rakhte hain, kyunki
  // update/delete/toggle endpoints ko "id" chahiye hoti hai, "code" nahi
  couponIds: Record<string, number>
  loading: boolean

  fetchCoupons: () => Promise<void>
  addCoupon: (coupon: AdminCoupon) => Promise<void>
  updateCoupon: (code: string, coupon: AdminCoupon) => Promise<void>
  deleteCoupon: (code: string) => Promise<void>
  toggleActive: (code: string) => Promise<void>
}

/**
 * Admin Coupons — ab REAL backend (/api/coupons) se juda hai.
 * NOTE: Backend endpoints "id" (numeric) se identify karte hain,
 * frontend UI "code" (string, jaise "WELCOME200") se — isliye ek
 * chhota "couponIds" map rakhte hain jo code->id mapping karta hai.
 */
export const useAdminCouponsStore = create<AdminCouponsState>((set, get) => ({
  coupons: [],
  couponIds: {},
  loading: false,

  fetchCoupons: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendCoupon[]>('/coupons')
    const couponIds: Record<string, number> = {}
    response.data.forEach((c) => {
      couponIds[c.code] = c.id
    })
    set({ coupons: response.data.map(mapBackendCoupon), couponIds, loading: false })
  },

  addCoupon: async (coupon) => {
    const response = await apiClient.post<BackendCoupon>('/coupons', {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      expiresAt: coupon.expiresAt,
    })
    const created = response.data
    set((state) => ({
      coupons: [...state.coupons, mapBackendCoupon(created)],
      couponIds: { ...state.couponIds, [created.code]: created.id },
    }))
  },

  updateCoupon: async (code, coupon) => {
    const id = get().couponIds[code]
    const response = await apiClient.put<BackendCoupon>(`/coupons/${id}`, {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      expiresAt: coupon.expiresAt,
    })
    const updated = response.data
    set((state) => {
      const nextIds = { ...state.couponIds }
      // Agar code khud badla hai, purana mapping hata ke naya daal dete hain
      delete nextIds[code]
      nextIds[updated.code] = updated.id
      return {
        coupons: state.coupons.map((c) => (c.code === code ? mapBackendCoupon(updated) : c)),
        couponIds: nextIds,
      }
    })
  },

  deleteCoupon: async (code) => {
    const id = get().couponIds[code]
    await apiClient.delete(`/coupons/${id}`)
    set((state) => ({ coupons: state.coupons.filter((c) => c.code !== code) }))
  },

  toggleActive: async (code) => {
    const id = get().couponIds[code]
    const response = await apiClient.put<BackendCoupon>(`/coupons/${id}/toggle-active`)
    const updated = mapBackendCoupon(response.data)
    set((state) => ({ coupons: state.coupons.map((c) => (c.code === code ? updated : c)) }))
  },
}))