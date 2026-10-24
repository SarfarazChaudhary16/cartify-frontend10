import { LegalPageLayout } from './components/LegalPageLayout'
import { termsContent } from '@/mocks/legalContent'

export default function TermsPage() {
  return <LegalPageLayout title="Terms of Service" doc={termsContent} />
}