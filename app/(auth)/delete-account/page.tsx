"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-lg w-full">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={16} />
          Back to Account
        </Link>

        <Card className="border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldAlert className="h-8 w-8" />
              <div>
                <CardTitle className="text-xl uppercase">Account Deletion</CardTitle>
                <CardDescription>
                  This feature is temporarily unavailable
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Account deletion is currently undergoing maintenance. Please contact support if you need to deactivate your account.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/account">Return to Account</Link>
              </Button>
              <Button asChild className="flex-1 btn-pana">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
