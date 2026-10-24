import axios from 'axios'
import { useLoadingStore } from '@/store/useLoadingStore'

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  // NAYA: Token ab dono jagah check karte hain — "Remember me" checked
  // tha to localStorage mein hoga (browser band karke bhi persist rahega),
  // unchecked tha to sessionStorage mein hoga (tab band hote hi gayab)
  const token = localStorage.getItem('cartify_token') || sessionStorage.getItem('cartify_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // NAYA: HAR request shuru hote hi loading-counter badhate hain —
  // isi se TopLoadingBar automatically dikhने lagegा, bina kisi page
  // mein manually kuch likhe
  useLoadingStore.getState().startRequest()

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    // Request SUCCESSFULLY complete hui — counter kam karte hain
    useLoadingStore.getState().endRequest()
    return response
  },
  (error) => {
    // Request FAIL bhi hui to bhi counter kam karna ZAROORI hai —
    // warna loader HAMESHA ke liye atka reh jaega (kyunki humne sirf
    // "start" kiya tha, "end" kabhi nahi hua)
    useLoadingStore.getState().endRequest()

    if (error.response?.status === 401) {
      localStorage.removeItem('cartify_token')
    }
    return Promise.reject(error)
  }
)