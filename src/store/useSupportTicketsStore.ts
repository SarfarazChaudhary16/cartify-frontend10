import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface TicketTrackingStep {
  status: TicketStatus
  label: string
  timestamp: string | null
  completed: boolean
}

export interface SupportTicket {
  id: string
  ticketNumber: string
  subject: string
  category: string
  orderNumber?: string
  description: string
  attachmentName?: string
  attachmentUrl?: string
  userName?: string
  userEmail?: string
  status: TicketStatus
  createdAt: string
  trackingSteps: TicketTrackingStep[]
}

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

interface AddTicketInput {
  subject: string
  category: string
  orderNumber?: string
  description: string
  attachmentName?: string
  attachmentUrl?: string
}

interface SupportTicketsState {
  tickets: SupportTicket[]
  loading: boolean
  fetchMyTickets: () => Promise<void>
  fetchTicketById: (id: string) => Promise<SupportTicket>
  addTicket: (ticket: AddTicketInput) => Promise<SupportTicket>
  uploadAttachment: (file: File) => Promise<string>
}

export const useSupportTicketsStore = create<SupportTicketsState>((set, get) => ({
  tickets: [],
  loading: false,

  fetchMyTickets: async () => {
    set({ loading: true })
    const response = await apiClient.get<BackendTicket[]>('/support-tickets/my-tickets')
    set({ tickets: response.data.map(mapBackendTicket), loading: false })
  },

  // NAYA: ek specific ticket ki DETAILS (tracking-timeline samet) laane
  // ke liye — Order Tracking page jaisa hi pattern
  fetchTicketById: async (id) => {
    const response = await apiClient.get<BackendTicket>(`/support-tickets/${id}`)
    const mapped = mapBackendTicket(response.data)
    set((state) => {
      const exists = state.tickets.some((t) => t.id === mapped.id)
      return { tickets: exists ? state.tickets.map((t) => (t.id === mapped.id ? mapped : t)) : [mapped, ...state.tickets] }
    })
    return mapped
  },

  addTicket: async (ticket) => {
    const response = await apiClient.post<BackendTicket>('/support-tickets', ticket)
    const created = mapBackendTicket(response.data)
    set((state) => ({ tickets: [created, ...state.tickets] }))
    return created
  },

  // NAYA: Real image-upload — Cloudinary tak file bhejta hai, wapas
  // uska URL milta hai (jo phir addTicket() ke "attachmentUrl" mein jata hai)
  uploadAttachment: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post<{ message: string }>('/support-tickets/upload-attachment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // Backend "message" field mein hi URL "carry" kar raha hai (chhota
    // reuse-trick, alag DTO nahi banaya tha) — isliye yahan usi field se nikalte hain
    return response.data.message
  },
}))