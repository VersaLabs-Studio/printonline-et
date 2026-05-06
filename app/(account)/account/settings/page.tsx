"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, Building, MapPin, Lock } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const [profile, setProfile] = React.useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    tin_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    sub_city: "",
    woreda: "",
  });

  const [passwords, setPasswords] = React.useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/account/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.profile) {
            setProfile({
              full_name: json.profile.full_name || "",
              email: json.profile.email || "",
              phone: json.profile.phone || "",
              company_name: json.profile.company_name || "",
              tin_number: json.profile.tin_number || "",
              address_line1: json.profile.address_line1 || "",
              address_line2: json.profile.address_line2 || "",
              city: json.profile.city || "",
              sub_city: json.profile.sub_city || "",
              woreda: json.profile.woreda || "",
            });
          }
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/account/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.full_name,
          phone: profile.phone,
          company_name: profile.company_name,
          tin_number: profile.tin_number,
          address_line1: profile.address_line1,
          address_line2: profile.address_line2,
          city: profile.city,
          sub_city: profile.sub_city,
          woreda: profile.woreda,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update profile");
      }
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: passwords.current_password,
          new_password: passwords.new_password,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to change password");
      }
      toast.success("Password changed");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CMSPageHeader
        title="Account Settings"
        subtitle="Manage your personal information and shipping address."
        breadcrumbs={[{ label: "Account Settings" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                <User size={16} className="text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Full Name
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Email
                  </label>
                  <Input
                    className="rounded-xl bg-muted/50"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Phone
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                <Building size={16} className="text-primary" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Company Name
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.company_name}
                    onChange={(e) =>
                      setProfile({ ...profile, company_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    TIN Number
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.tin_number}
                    onChange={(e) =>
                      setProfile({ ...profile, tin_number: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Address Line 1
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.address_line1}
                    onChange={(e) =>
                      setProfile({ ...profile, address_line1: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Address Line 2
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.address_line2}
                    onChange={(e) =>
                      setProfile({ ...profile, address_line2: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    City
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Sub-City
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.sub_city}
                    onChange={(e) =>
                      setProfile({ ...profile, sub_city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-tight">
                    Woreda
                  </label>
                  <Input
                    className="rounded-xl"
                    value={profile.woreda}
                    onChange={(e) =>
                      setProfile({ ...profile, woreda: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            className="h-12 rounded-xl shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-xs gap-2 px-8"
            onClick={handleSaveProfile}
            disabled={isSaving}
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                <Lock size={16} className="text-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-tight">
                  Current Password
                </label>
                <Input
                  type="password"
                  className="rounded-xl"
                  value={passwords.current_password}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      current_password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-tight">
                  New Password
                </label>
                <Input
                  type="password"
                  className="rounded-xl"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      new_password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-tight">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  className="rounded-xl"
                  value={passwords.confirm_password}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                <Lock size={14} />
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
