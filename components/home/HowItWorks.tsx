"use client";

import { FileUp, Palette, Printer, Truck } from "lucide-react";
import { CSSFadeIn } from "@/components/shared/SafeMotion";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Upload & Order",
      description:
        "Choose your product and upload your design files, or request a custom design from our team.",
      icon: <FileUp className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Design Approval",
      description:
        "Review digital proofs and approve the design before we send it to production.",
      icon: <Palette className="h-8 w-8" />,
    },
    {
      id: 3,
      title: "High-Quality Printing",
      description:
        "We use state-of-the-art technology to ensure vibrant colors and sharp details.",
      icon: <Printer className="h-8 w-8" />,
    },
    {
      id: 4,
      title: "Fast Delivery",
      description:
        "Your order is carefully packaged and shipped directly to your doorstep.",
      icon: <Truck className="h-8 w-8" />,
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <CSSFadeIn className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            How It Works
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            From file upload to final delivery, we make printing easy and
            hassle-free.
          </p>
        </CSSFadeIn>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-linear-to-r from-transparent via-border to-transparent z-0"></div>

          {steps.map((step, idx) => (
            <CSSFadeIn key={step.id} delay={idx * 150} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-card rounded-2xl border-2 border-border/50 shadow-sm flex items-center justify-center mb-6 group-hover:border-primary/50 group-hover:shadow-primary/20 group-hover:scale-110 transition-all duration-300">
                <div className="text-primary bg-primary/10 p-4 rounded-xl">
                  {step.icon}
                </div>
              </div>

              <div className="bg-primary text-primary-foreground text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center absolute top-20 -right-2 border-2 border-background z-20 shadow-md">
                {step.id}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </CSSFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
