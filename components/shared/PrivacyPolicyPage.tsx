"use client";

import { ReactNode } from "react";

const FALLBACK_CONTENT: Record<string, { title: string; content: ReactNode }> = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Name and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our products and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Data Protection</h2>
          <p className="text-muted-foreground leading-relaxed">We implement appropriate security measures to protect your personal information. Your data is stored securely and only accessible to authorized personnel.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">For privacy-related inquiries, contact us at:</p>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> panapromotionplc@gmail.com</p>
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Address:</span> Hayahulet Rd., Addis Ababa, Ethiopia</p>
          </div>
        </section>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    content: (
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Terms of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using PrintOnline.et, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Use of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to use our service only for lawful purposes and in accordance with these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Orders and Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            All orders are subject to acceptance and availability. Prices are subject to change without notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Shipping and Delivery</h2>
          <p className="text-muted-foreground leading-relaxed">
            We strive to deliver products within the estimated timeframe, but delays may occur due to unforeseen circumstances.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            PrintOnline.et shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service.
          </p>
        </section>
      </div>
    ),
  },
  cookie: {
    title: "Cookie Policy",
    content: (
      <div className="space-y-8">
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">What Are Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help us provide a better browsing experience.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">How We Use Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">We use cookies for:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Essential cookies</strong>: Required for the website to function (cart, authentication)</li>
            <li><strong className="text-foreground">Analytics cookies</strong>: Help us understand how visitors use our site</li>
            <li><strong className="text-foreground">Preference cookies</strong>: Remember your settings and preferences</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Types of Cookies We Use</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-left font-semibold text-foreground border-b border-border">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground border-b border-border">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground border-b border-border">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Session cookies</td>
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Maintain your session while browsing</td>
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Session</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Cart cookies</td>
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Remember items in your shopping cart</td>
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">30 days</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Authentication cookies</td>
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">Keep you logged in</td>
                  <td className="px-4 py-3 text-muted-foreground border-b border-border">7 days</td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">Preference cookies</td>
                  <td className="px-4 py-3 text-muted-foreground">Remember your display preferences</td>
                  <td className="px-4 py-3 text-muted-foreground">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Managing Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">You can control cookies through your browser settings. Disabling certain cookies may affect website functionality.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Third-Party Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">We do not use third-party tracking cookies. Analytics are collected using privacy-friendly methods.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">For questions about our cookie policy, contact us at:</p>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> panapromotionplc@gmail.com</p>
          </div>
        </section>
      </div>
    ),
  },
};

interface PrivacyPolicyPageProps {
  policyType: "privacy" | "terms" | "cookie";
}

export function PrivacyPolicyPage({ policyType }: PrivacyPolicyPageProps) {
  const fallback = FALLBACK_CONTENT[policyType];

  if (!fallback) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Policy Not Found</h1>
          <p className="text-muted-foreground text-lg">The requested policy page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{fallback.title}</h1>
        <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
          {fallback.content}
        </div>
      </div>
    </div>
  );
}
