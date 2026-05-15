"use client";

import { ReactNode } from "react";
import { usePrivacyPolicies } from "@/hooks/data/usePrivacyPolicies";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorFallback } from "@/components/shared/ErrorFallback";

const FALLBACK_CONTENT: Record<string, { title: string; content: ReactNode }> = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Privacy Policy</h2>
        <p>
          At PrintOnline.et, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        <h3 className="text-xl font-semibold">Information We Collect</h3>
        <p>
          We may collect personal information such as your name, email address, phone number, and shipping address when you place an order or contact us.
        </p>
        <h3 className="text-xl font-semibold">How We Use Your Information</h3>
        <p>
          We use the information we collect to process orders, communicate with you about your orders, and improve our services.
        </p>
        <h3 className="text-xl font-semibold">Data Protection</h3>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </p>
        <h3 className="text-xl font-semibold">Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy, please contact us at panapromotionplc@gmail.com.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Terms of Service</h2>
        <p>
          By accessing or using PrintOnline.et, you agree to be bound by these Terms of Service.
        </p>
        <h3 className="text-xl font-semibold">Use of Service</h3>
        <p>
          You agree to use our service only for lawful purposes and in accordance with these terms.
        </p>
        <h3 className="text-xl font-semibold">Orders and Payments</h3>
        <p>
          All orders are subject to acceptance and availability. Prices are subject to change without notice.
        </p>
        <h3 className="text-xl font-semibold">Shipping and Delivery</h3>
        <p>
          We strive to deliver products within the estimated timeframe, but delays may occur due to unforeseen circumstances.
        </p>
        <h3 className="text-xl font-semibold">Limitation of Liability</h3>
        <p>
          PrintOnline.et shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service.
        </p>
      </div>
    ),
  },
  cookie: {
    title: "Cookie Policy",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Cookie Policy</h2>
        <p>
          This Cookie Policy explains how PrintOnline.et uses cookies and similar tracking technologies.
        </p>
        <h3 className="text-xl font-semibold">What Are Cookies</h3>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help us improve your browsing experience.
        </p>
        <h3 className="text-xl font-semibold">How We Use Cookies</h3>
        <p>
          We use cookies to remember your preferences, understand how you use our site, and improve our services.
        </p>
        <h3 className="text-xl font-semibold">Managing Cookies</h3>
        <p>
          You can control and manage cookies in your browser settings. Please note that disabling cookies may affect your experience on our site.
        </p>
        <h3 className="text-xl font-semibold">Contact Us</h3>
        <p>
          For more information about our use of cookies, please contact us at panapromotionplc@gmail.com.
        </p>
      </div>
    ),
  },
};

interface PrivacyPolicyPageProps {
  policyType: "privacy" | "terms" | "cookie";
}

export function PrivacyPolicyPage({ policyType }: PrivacyPolicyPageProps) {
  const { data, isLoading, error, refetch } = usePrivacyPolicies();

  if (isLoading) {
    return <LoadingState message="Loading policy..." />;
  }

  if (error) {
    return (
      <ErrorFallback
        error={error as Error & { digest?: string }}
        onReset={() => refetch()}
        title="Failed to load policy"
        description="Unable to load the policy content. Showing default version instead."
        className="mb-8"
      />
    );
  }

  const policy = Array.isArray(data)
    ? data.find((item: { policy_type?: string }) => item.policy_type === policyType)
    : null;

  if (policy) {
    const content = typeof policy.content === "string" ? policy.content : "";
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{policy.title || FALLBACK_CONTENT[policyType]?.title}</h1>
        <div className="prose max-w-none whitespace-pre-wrap text-muted-foreground">
          {content}
        </div>
      </div>
    );
  }

  const fallback = FALLBACK_CONTENT[policyType];

  if (!fallback) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Policy Not Found</h1>
        <p className="text-muted-foreground">The requested policy page could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{fallback.title}</h1>
      <div className="text-muted-foreground leading-relaxed">
        {fallback.content}
      </div>
    </div>
  );
}
