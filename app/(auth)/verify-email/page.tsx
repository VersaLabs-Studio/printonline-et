// app/(auth)/verify-email/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pt-8">
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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-balance px-4">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Return to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
