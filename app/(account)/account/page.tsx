// app/(account)/account/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfoSection } from "@/components/account/PersonalInfoSection";
import { BusinessDetailsSection } from "@/components/account/BusinessDetailsSection";
import { ShippingAddressSection } from "@/components/account/ShippingAddressSection";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountDashboardPage() {
  const {
    data: session,
    isPending: isSessionPending,
    refetch,
  } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetching, setIsDataFetching] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
  });

  // Fetch full profile including address from Supabase
  useEffect(() => {
    async function fetchFullProfile() {
      if (!session?.user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from("customer_profiles")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .single();

        if (error) throw error;

        if (profile) {
          reset({
            name: session.user.name,
            phone: session.user.phone || profile.phone || "",
            companyName: session.user.companyName || profile.company_name || "",
            tinNumber: session.user.tinNumber || profile.tin_number || "",
            addressLine1: profile.address_line1 || "",
            addressLine2: profile.address_line2 || "",
            city: profile.city || "Addis Ababa",
            subCity: profile.sub_city || "",
            woreda: profile.woreda || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsDataFetching(false);
      }
    }

    if (!isSessionPending) {
      fetchFullProfile();
    }
  }, [session, isSessionPending, reset, supabase]);

  const onSubmit = async (values: ProfileUpdateInput) => {
    setIsLoading(true);
    try {
      const { error: authError } = await authClient.updateUser({
        name: values.name,
        phone: values.phone || undefined,
        companyName: values.companyName || undefined,
        tinNumber: values.tinNumber || undefined,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("customer_profiles")
        .update({
          full_name: values.name,
          phone: values.phone || null,
          company_name: values.companyName || null,
          tin_number: values.tinNumber || null,
          address_line1: values.addressLine1 || null,
          address_line2: values.addressLine2 || null,
          city: values.city || null,
          sub_city: values.subCity || null,
          woreda: values.woreda || null,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", session!.user.id);

      if (profileError) throw profileError;

      toast.success("Profile updated successfully!");
      await refetch();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to update profile");
      console.error("[PROFILE_UPDATE_ERROR]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      toast.success("Account deactivated successfully");
      await authClient.signOut();
      router.push("/");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isSessionPending || isDataFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal and business information.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-border/50 shadow-lg overflow-hidden backdrop-blur-sm bg-card/95">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={20} />
              <CardTitle className="text-lg text-foreground">
                Personal Information
              </CardTitle>
            </div>
            <CardDescription>
              Update your personal and business details.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <PersonalInfoSection
              register={register}
              errors={errors}
              email={session?.user?.email}
            />

            <Separator className="my-6 opacity-50" />

            <BusinessDetailsSection register={register} errors={errors} />

            <Separator className="my-6 opacity-50" />

            <ShippingAddressSection
              register={register}
              control={control}
              errors={errors}
            />
          </CardContent>
          <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              className="min-w-[120px]"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
            <Button
              type="submit"
              className="btn-pana min-w-[120px]"
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
