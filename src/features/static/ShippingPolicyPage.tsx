import { LegalPageLayout } from './components/LegalPageLayout'
import { shippingContent } from '@/mocks/legalContent'

export default function ShippingPolicyPage() {
  return <LegalPageLayout title="Shipping Policy" doc={shippingContent} />
}