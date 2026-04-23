// components/home/NewsletterSignup.tsx
"use client";

import { useState } from "react";
import { Mail, Gift, CheckCircle, Sparkles } from "lucide-react";
import { CSSFadeIn } from "@/components/shared/SafeMotion";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-primary/90"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <CSSFadeIn className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-16 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 shadow-inner border border-white/10">
                <Mail className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Unlock Exclusive Perks
              </h2>

              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our community to get early access to new collections,
                design tips, and{" "}
                <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                  10% OFF
                </span>{" "}
                your first order.
              </p>

              {!isSubmitted ? (
                <CSSFadeIn delay={200}>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                  >
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-foreground placeholder-muted-foreground border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-lg"
                      required
                    />
                  </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center w-full sm:w-auto hover:scale-105 active:scale-95"
                    >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                    </button>
                  </form>
                </CSSFadeIn>
              ) : (
                <CSSFadeIn className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/30">
                  <div className="flex flex-col items-center justify-center space-y-4 text-white">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      You&apos;re on the list!
                    </h3>
                    <p className="text-white/80">
                      Keep an eye on your inbox for your welcome gift.
                    </p>
                  </div>
                </CSSFadeIn>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/80 text-sm font-bold">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Gift className="h-4 w-4" />
                  <span>Welcome discount</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Sparkles className="h-4 w-4" />
                  <span>Exclusive designs</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span>No spam guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </CSSFadeIn>
      </div>
    </section>
  );
};

export default NewsletterSignup;
