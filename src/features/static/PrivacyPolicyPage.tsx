import { LegalPageLayout } from './components/LegalPageLayout'
import { privacyContent } from '@/mocks/legalContent'

export default function PrivacyPolicyPage() {
  return <LegalPageLayout title="Privacy Policy" doc={privacyContent} />
}