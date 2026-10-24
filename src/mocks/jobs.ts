export interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Contract' | 'Internship'
}

export const jobOpenings: JobOpening[] = [
  { id: 'j-1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Pune (Hybrid)', type: 'Full-time' },
  { id: 'j-2', title: 'Backend Engineer — Spring Boot', department: 'Engineering', location: 'Pune (Hybrid)', type: 'Full-time' },
  { id: 'j-3', title: 'Product Designer', department: 'Design', location: 'Remote (India)', type: 'Full-time' },
  { id: 'j-4', title: 'Category Manager — Footwear', department: 'Merchandising', location: 'Mumbai', type: 'Full-time' },
  { id: 'j-5', title: 'Customer Support Associate', department: 'Support', location: 'Pune', type: 'Full-time' },
  { id: 'j-6', title: 'Marketing Intern', department: 'Marketing', location: 'Remote (India)', type: 'Internship' },
]