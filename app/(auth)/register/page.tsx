// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validations";
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
import {
  Loader2,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Fingerprint,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { SafeMotionDiv } from "@/components/shared/SafeMotion";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirect");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      tinNumber: "",
      companyName: "",
    },
  });

  const onSubmit = async (values: SignUpInput) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone || undefined,
        tinNumber: values.tinNumber || undefined,
        companyName: values.companyName || undefined,
      } as any);

      if (error) {
        toast.error(
          error.message || "Something went wrong during registration.",
        );
      } else {
        toast.success("Account created successfully! Please log in.");
        const redirectUrl = callbackUrl
          ? `&redirect=${encodeURIComponent(callbackUrl)}`
          : "";
        router.push(`/login?registered=true${redirectUrl}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error("[REGISTER_ERROR]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeMotionDiv
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
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
            Create account
          </CardTitle>
          <CardDescription className="text-center">
            Join Pana Promotion for easy online printing management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs font-bold text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="0912345678"
                    className="pl-10"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-bold text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs font-bold text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="divider-pana my-6 opacity-30 px-4" />

            <div className="text-sm font-semibold mb-2">
              Business Information (Optional)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="XYZ PLC"
                    className="pl-10"
                    {...register("companyName")}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-xs font-bold text-destructive">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tinNumber">TIN Number (10 digits)</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tinNumber"
                    placeholder="1234567890"
                    className="pl-10"
                    {...register("tinNumber")}
                  />
                </div>
                {errors.tinNumber && (
                  <p className="text-xs font-bold text-destructive">
                    {errors.tinNumber.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-pana h-11 mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 border-t border-border/50 bg-muted/20 py-4 px-6 rounded-b-(--radius)">
          <span className="text-sm text-muted-foreground">
            Already have an account?
          </span>
          <Link
            href={
              callbackUrl
                ? `/login?redirect=${encodeURIComponent(callbackUrl)}`
                : "/login"
            }
            className="text-sm font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>

      <div className="mt-6 px-4 text-center text-xs text-muted-foreground leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </div>
    </SafeMotionDiv>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
