import { LegalPageLayout } from './components/LegalPageLayout'
import { refundContent } from '@/mocks/legalContent'

export default function RefundPolicyPage() {
  return <LegalPageLayout title="Refund Policy" doc={refundContent} />
}