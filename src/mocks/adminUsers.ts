export interface AdminUserRecord {
  id: string
  name: string
  email: string
  phone: string
  joinedAt: string
  ordersCount: number
  totalSpent: number
  status: 'active' | 'blocked'
}

export const adminUsers: AdminUserRecord[] = [
  { id: 'u-1', name: 'Motu Sharma', email: 'motu@example.com', phone: '+91 98765 43210', joinedAt: '2025-11-02', ordersCount: 3, totalSpent: 11296, status: 'active' },
  { id: 'u-2', name: 'Ankit R.', email: 'ankit.r@example.com', phone: '+91 98123 45671', joinedAt: '2025-09-14', ordersCount: 7, totalSpent: 34580, status: 'active' },
  { id: 'u-3', name: 'Priya M.', email: 'priya.m@example.com', phone: '+91 97456 12309', joinedAt: '2025-12-20', ordersCount: 2, totalSpent: 5998, status: 'active' },
  { id: 'u-4', name: 'Sameer K.', email: 'sameer.k@example.com', phone: '+91 96345 78012', joinedAt: '2026-01-05', ordersCount: 5, totalSpent: 21450, status: 'active' },
  { id: 'u-5', name: 'Ritika Nair', email: 'ritika.n@example.com', phone: '+91 99887 65432', joinedAt: '2026-02-11', ordersCount: 1, totalSpent: 6499, status: 'active' },
  { id: 'u-6', name: 'Kabir Singh', email: 'kabir.s@example.com', phone: '+91 91234 56789', joinedAt: '2026-03-01', ordersCount: 4, totalSpent: 18200, status: 'blocked' },
  { id: 'u-7', name: 'Neha Verma', email: 'neha.v@example.com', phone: '+91 90123 45678', joinedAt: '2026-03-22', ordersCount: 0, totalSpent: 0, status: 'active' },
]