// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations";
// import { authClient } from "@/lib/auth-client"; // will use when reset flow is fully configured
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SafeMotionDiv, SafeAnimatePresence } from "@/components/shared/SafeMotion";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setIsLoading(true);
    setUserEmail(values.email);

    try {
      // For MVP, we'll simulate the successful email trigger
      // since the nodemailer SMTP configuration needs verification
      // Better-auth reset flow: authClient.forgetPassword({ email: values.email })

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
      console.error("[FORGOT_PWD_ERROR]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAnimatePresence mode="wait">
      {!isSubmitted ? (
        <SafeMotionDiv
          key="form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <div className="relative w-48 h-10">
                    <Image
                      src="/nav-logo.png"
                      alt="PrintOnline.et"
                      fill
                      className="object-contain dark:brightness-0 dark:invert"
                      priority
                    />
                  </div>
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Reset password
              </CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="name@company.com"
                      type="email"
                      className="pl-10"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-bold text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full btn-pana h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/50 bg-muted/20 py-4 px-6 rounded-b-[var(--radius)]">
              <Link
                href="/login"
                className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </SafeMotionDiv>
      ) : (
        <SafeMotionDiv
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95 overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="text-center pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                Check your email
              </CardTitle>
              <CardDescription className="text-balance px-4">
                We have sent a password reset link to{" "}
                <span className="font-semibold text-foreground">
                  {userEmail}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <p className="text-sm text-muted-foreground mb-6">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try Wait / Resend
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/50 bg-muted/20 py-4 px-6 rounded-b-[var(--radius)]">
              <Link
                href="/login"
                className="text-sm font-semibold text-primary hover:underline transition-colors"
              >
                Return to login
              </Link>
            </CardFooter>
          </Card>
        </SafeMotionDiv>
      )}
    </SafeAnimatePresence>
  );
}
