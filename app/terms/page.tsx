import { PrivacyPolicyPage } from "@/components/shared/PrivacyPolicyPage";

export const metadata = {
  title: "Terms of Service - PrintOnline.et",
  description: "PrintOnline.et terms of service",
};

export default function TermsPage() {
  return <PrivacyPolicyPage policyType="terms" />;
}
