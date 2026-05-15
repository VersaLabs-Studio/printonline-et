import { PrivacyPolicyPage } from "@/components/shared/PrivacyPolicyPage";

export const metadata = {
  title: "Cookie Policy - PrintOnline.et",
  description: "PrintOnline.et cookie policy",
};

export default function CookiePolicyPage() {
  return <PrivacyPolicyPage policyType="cookie" />;
}
