// app/(auth)/reset-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
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
import { Loader2, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { SafeMotionDiv } from "@/components/shared/SafeMotion";
import { Suspense } from "react";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!token) {
    return (
      <SafeMotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center">
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/forgot-password">
              <Button variant="outline" className="rounded-xl">
                Request New Link
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </SafeMotionDiv>
    );
  }

  const onSubmit = async (values: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.newPassword,
        token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password. The link may have expired.");
      } else {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error("[RESET_PASSWORD_ERROR]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeMotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              Password Reset Successfully
            </CardTitle>
            <CardDescription className="text-center">
              Your password has been updated. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button className="btn-pana rounded-xl gap-2">
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </SafeMotionDiv>
    );
  }

  return (
    <SafeMotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs font-bold text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pl-10 pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-bold text-destructive">
                  {errors.confirmPassword.message}
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
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 bg-muted/20 py-4 px-6 rounded-b-(--radius)">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </SafeMotionDiv>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
