import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { Address } from '@/types'

interface BackendAddress {
  id: number
  label: string
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault: boolean // Jackson quirk yahan LAGU NAHI hota kyunki backend field "isDefault" hai
                       // aur Entity mein bhi getter "isDefault()" (na ki "isIsDefault()") hai —
                       // is case mein Jackson field-naam SEEDHA rakhta hai
}

function mapBackendAddress(a: BackendAddress): Address {
  return {
    id: String(a.id),
    label: a.label,
    fullName: a.fullName,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    phone: a.phone,
    isDefault: a.isDefault,
  }
}

interface AddressesState {
  addresses: Address[]
  loading: boolean
  fetchAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, 'id'>) => Promise<Address>
  updateAddress: (id: string, patch: Omit<Address, 'id'>) => Promise<void>
  removeAddress: (id: string) => Promise<void>
  setDefault: (id: string) => Promise<void>
  resetLocal: () => void
}

/**
 * Saved addresses — ab REAL backend (/api/addresses) se juda hai.
 * Account > Addresses page aur Checkout's address-step, dono isi store
 * ko use karenge.
 */
export const useAddressesStore = create<AddressesState>((set) => ({
  addresses: [],
  loading: false,

  fetchAddresses: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendAddress[]>('/addresses')
    set({ addresses: response.data.map(mapBackendAddress), loading: false })
  },

  addAddress: async (address) => {
    const response = await apiClient.post<BackendAddress>('/addresses', address)
    const created = mapBackendAddress(response.data)
    set((state) => ({ addresses: [...state.addresses, created] }))
    return created
  },

  updateAddress: async (id, patch) => {
    const response = await apiClient.put<BackendAddress>(`/addresses/${id}`, patch)
    const updated = mapBackendAddress(response.data)
    set((state) => ({ addresses: state.addresses.map((a) => (a.id === id ? updated : a)) }))
  },

  removeAddress: async (id) => {
    await apiClient.delete(`/addresses/${id}`)
    set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) }))
  },

  setDefault: async (id) => {
    const response = await apiClient.put<BackendAddress>(`/addresses/${id}/set-default`)
    const updated = mapBackendAddress(response.data)
    // Backend ne is address ko default banaya, aur baaki saari addresses
    // ka isDefault=false kar diya (Service layer mein logic tha) — lekin
    // response mein sirf YE EK address wapas aati hai, baaki purani
    // list mein already the. Isliye humein LOCALLY bhi baaki sabka
    // isDefault manually false karna hoga (taaki UI turant sahi dikhe,
    // dobara poori list fetch kiye bina)
    set((state) => ({
      addresses: state.addresses.map((a) => (a.id === id ? updated : { ...a, isDefault: false })),
    }))
  },
  resetLocal: () => set({ addresses: [] }),
}))