// app/contact/page.tsx
"use client";

import { CSSFadeIn } from "@/components/shared/SafeMotion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/lib/validations/cms";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "Hire a Designer Request",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data: { success?: boolean; message?: string; error?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok || data.success !== true) {
        toast.error(data.error || "Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent!", {
        description:
          data.message ||
          "Our design team will contact you regarding your request.",
      });
      reset({ ...values, message: "" });
    } catch (err) {
      console.error("[CONTACT_SUBMIT_ERROR]:", err);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <CSSFadeIn className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Contact Our Design Team
            </h1>
            <p className="text-muted-foreground text-lg">
              Need professional help with your design? Our experts are here to
              bring your vision to life.
            </p>
          </CSSFadeIn>

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
                      order@printonline.et
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
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-name"
                        className="text-sm font-bold"
                      >
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        aria-invalid={errors.name ? "true" : "false"}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs font-bold text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-email"
                        className="text-sm font-bold"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        aria-invalid={errors.email ? "true" : "false"}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs font-bold text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-phone"
                        className="text-sm font-bold"
                      >
                        Phone{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+251 9.. .. .. .."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        aria-invalid={errors.phone ? "true" : "false"}
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-xs font-bold text-destructive">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-subject"
                        className="text-sm font-bold"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="I need help with my design"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        aria-invalid={errors.subject ? "true" : "false"}
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-xs font-bold text-destructive">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-bold"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us about your design requirements..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                      aria-invalid={errors.message ? "true" : "false"}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs font-bold text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-pana py-3 rounded-lg font-bold flex items-center justify-center space-x-2"
                  >
                    <span>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
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
