"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";
import { CSSFadeIn } from "@/components/shared/SafeMotion";

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email address";
    if (!formData.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setIsSubmitted(true);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
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
                <MessageSquare className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Get In Touch
              </h2>

              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Have a question or need a quote? Reach out to us and we&apos;ll get back to you within 24 hours.
              </p>

              {!isSubmitted ? (
                <CSSFadeIn delay={200}>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 max-w-lg mx-auto text-left"
                  >
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-foreground placeholder-muted-foreground border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-lg"
                      />
                      {errors.name && <p className="text-red-300 text-sm mt-1 text-left">{errors.name}</p>}
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-foreground placeholder-muted-foreground border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-lg"
                      />
                      {errors.email && <p className="text-red-300 text-sm mt-1 text-left">{errors.email}</p>}
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number (optional)"
                        className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-foreground placeholder-muted-foreground border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-lg"
                      />
                    </div>

                    <div>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-foreground border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-lg"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Quote Request">Quote Request</option>
                        <option value="Design Consultation">Design Consultation</option>
                        <option value="Support">Support</option>
                      </select>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={4}
                        className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-foreground placeholder-muted-foreground border-2 border-transparent focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-lg resize-none"
                      />
                      {errors.message && <p className="text-red-300 text-sm mt-1 text-left">{errors.message}</p>}
                    </div>

                    {errors.form && (
                      <p className="text-red-300 text-sm text-center">{errors.form}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center w-full hover:scale-105 active:scale-95"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></span>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Send Message
                        </span>
                      )}
                    </button>
                  </form>
                </CSSFadeIn>
              ) : (
                <CSSFadeIn className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/30">
                  <div className="flex flex-col items-center justify-center space-y-4 text-white">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      Message Sent!
                    </h3>
                    <p className="text-white/80">
                      We&apos;ll get back to you soon.
                    </p>
                  </div>
                </CSSFadeIn>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/80 text-sm font-bold">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Mail className="h-4 w-4" />
                  <span>info@printonline.et</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Phone className="h-4 w-4" />
                  <span>+251 11 123 4567</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <MapPin className="h-4 w-4" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>
          </div>
        </CSSFadeIn>
      </div>
    </section>
  );
};

export default ContactUsSection;
