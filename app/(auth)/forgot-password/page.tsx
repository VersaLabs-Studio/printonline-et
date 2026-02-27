// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      // Send the forgot password email via better-auth
      const { error } = await authClient.forgetPassword({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error("Process failed", {
          description: error.message || "Failed to send reset link.",
        });
      } else {
        setIsSuccess(true);
        toast.success("Reset link sent!", {
          description: "Check your email for instructions.",
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm"
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            {isSuccess ? "Check your email" : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSuccess
              ? "We've sent a password reset link to your email."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-pana py-2.5 rounded-lg flex items-center justify-center space-x-2 font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        ) : (
          <div className="mt-6 flex flex-col space-y-4">
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full bg-secondary text-secondary-foreground py-2.5 rounded-lg font-semibold hover:bg-secondary/80"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 inline-flex items-center"
          >
            <ArrowLeft className="h-3 w-3 mr-1" /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
