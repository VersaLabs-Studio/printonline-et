// app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent! We'll get back to you soon.", {
        description: "Our design team will contact you regarding your request.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Contact Our Design Team
            </h1>
            <p className="text-muted-foreground text-lg">
              Need professional help with your design? Our experts are here to
              bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">
                      Call Us
                    </p>
                    <p className="text-base font-bold text-foreground">
                      +251 116 68 69 40
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">
                      Email
                    </p>
                    <p className="text-base font-bold text-foreground">
                      design@printonline.et
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">
                      Visit Us
                    </p>
                    <p className="text-base font-bold text-foreground">
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h3 className="font-bold text-primary mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Design Consultation
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our professional designers can help you create the perfect
                  layout for your business cards, banners, and more.
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Your Name</label>
                      <input
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Subject</label>
                    <input
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="I need help with my design"
                      defaultValue="Hire a Designer Request"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                      placeholder="Tell us about your design requirements..."
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    className="w-full btn-pana py-3 rounded-lg font-bold flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
