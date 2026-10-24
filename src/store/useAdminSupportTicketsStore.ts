import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { SupportTicket, TicketStatus } from './useSupportTicketsStore'

interface BackendTrackingStep {
  status: string
  label: string
  timestamp: string | null
  completed: boolean
}

interface BackendTicket {
  id: number
  ticketNumber: string
  subject: string
  category: string
  orderNumber?: string
  description: string
  attachmentName?: string
  attachmentUrl?: string
  userName?: string
  userEmail?: string
  status: string
  createdAt: string
  trackingSteps: BackendTrackingStep[]
}

function mapBackendTicket(t: BackendTicket): SupportTicket {
  return {
    id: String(t.id),
    ticketNumber: t.ticketNumber,
    subject: t.subject,
    category: t.category,
    orderNumber: t.orderNumber,
    description: t.description,
    attachmentName: t.attachmentName,
    attachmentUrl: t.attachmentUrl,
    userName: t.userName,
    userEmail: t.userEmail,
    status: t.status.toLowerCase() as TicketStatus,
    createdAt: t.createdAt,
    trackingSteps: (t.trackingSteps ?? []).map((s) => ({
      status: s.status.toLowerCase() as TicketStatus,
      label: s.label,
      timestamp: s.timestamp,
      completed: s.completed,
    })),
  }
}

interface AdminSupportTicketsState {
  tickets: SupportTicket[]
  loading: boolean
  fetchAllTickets: () => Promise<void>
  updateStatus: (ticketId: string, status: TicketStatus) => Promise<void>
}

export const useAdminSupportTicketsStore = create<AdminSupportTicketsState>((set) => ({
  tickets: [],
  loading: false,

  fetchAllTickets: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendTicket[]>('/support-tickets/admin/all')
    set({ tickets: response.data.map(mapBackendTicket), loading: false })
  },

  updateStatus: async (ticketId, status) => {
    const response = await apiClient.put<BackendTicket>(
      `/support-tickets/admin/${ticketId}/status?status=${status.toUpperCase()}`,
    )
    const updated = mapBackendTicket(response.data)
    set((state) => ({ tickets: state.tickets.map((t) => (t.id === ticketId ? updated : t)) }))
  },
}))