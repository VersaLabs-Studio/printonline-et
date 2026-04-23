"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { SafeMotionDiv } from "@/components/shared/SafeMotion";
import { AlertTriangle, ArrowLeft, Lock, ShieldAlert, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { deleteAccountSchema, type DeleteAccountInput } from "@/lib/validations/auth";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const confirmDelete = watch("confirmDelete");

  const onSubmit = async (data: DeleteAccountInput) => {
    setIsLoading(true);
    try {
      // Call the delete account API
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete account");
      }

      // Account deleted successfully
      setIsDeleted(true);
      toast.success("Account deleted successfully");
      
      // Sign out and redirect to home
      setTimeout(() => {
        authClient.signOut();
        router.push("/");
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDeleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SafeMotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold uppercase tracking-tight">
              Account Deleted
            </h1>
            <p className="text-muted-foreground text-sm">
              Your account has been deactivated. You will be redirected to the home page shortly.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </SafeMotionDiv>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <SafeMotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={16} />
          Back to Account
        </Link>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert className="h-8 w-8" />
              <div>
                <CardTitle className="text-xl uppercase">Delete Account</CardTitle>
                <CardDescription>
                  This action cannot be undone
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warning Box */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Warning: This will deactivate your account</p>
                  <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                    <li>All your order history will be archived</li>
                    <li>Your profile information will be anonymized</li>
                    <li>You will lose access to your account dashboard</li>
                    <li>Pending orders will still be processed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="confirmDelete"
                  {...register("confirmDelete")}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="confirmDelete"
                  className="text-sm font-normal leading-relaxed"
                >
                  I understand that this action will permanently deactivate my account
                  and I will lose access to all my account information
                </Label>
              </div>
              {errors.confirmDelete && (
                <p className="text-sm text-red-500">{errors.confirmDelete.message}</p>
              )}

              <Button
                type="submit"
                variant="destructive"
                className="w-full h-12 font-semibold uppercase tracking-wider"
                disabled={isLoading || !confirmDelete}
              >
                {isLoading ? "Deleting Account..." : "Delete My Account"}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>
                Need help? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
              </p>
              <p>
                Changed your mind? Your account data will be retained for 30 days for recovery purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </SafeMotionDiv>
    </div>
  );
}
