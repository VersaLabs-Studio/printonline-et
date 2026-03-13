"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Fingerprint, 
  MapPin, 
  Calendar, 
  Edit3, 
  X, 
  Save,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { CustomerProfile } from "@/types";
import { useUpdateCustomer } from "@/hooks/data/useCustomers";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomerProfileInfoProps {
  customer: CustomerProfile;
}

export function CustomerProfileInfo({ customer }: CustomerProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateMutation = useUpdateCustomer();
  
  // Local form state
  const [formData, setFormData] = useState({
    full_name: customer.full_name,
    phone: customer.phone || "",
    company_name: customer.company_name || "",
    tin_number: customer.tin_number || "",
    address_line1: customer.address_line1 || "",
    city: customer.city || "Addis Ababa",
    sub_city: customer.sub_city || "",
    woreda: customer.woreda || "",
  });

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: customer.id,
        ...formData,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleToggleStatus = async () => {
    try {
      await updateMutation.mutateAsync({
        id: customer.id,
        is_active: !customer.is_active,
      });
      toast.success(`Account ${customer.is_active ? "deactivated" : "reactivated"}`);
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (isEditing) {
    return (
      <Card className="border-border/40 shadow-sm rounded-2xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between py-5 px-8 border-b border-border/40">
          <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-foreground/70">
            <Edit3 size={18} className="text-primary" /> Edit Profile
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(false)}
            className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-widest gap-2"
          >
            <X size={14} /> Cancel
          </Button>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="rounded-xl border-border/40 text-sm font-medium h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="rounded-xl border-border/40 text-sm font-medium h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Company Name</Label>
              <Input 
                value={formData.company_name} 
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                className="rounded-xl border-border/40 text-sm font-medium h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">TIN Number</Label>
              <Input 
                value={formData.tin_number} 
                onChange={(e) => setFormData({...formData, tin_number: e.target.value})}
                className="rounded-xl border-border/40 text-sm font-medium h-11"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Address Line</Label>
              <Input 
                value={formData.address_line1} 
                onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                className="rounded-xl border-border/40 text-sm font-medium h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">City</Label>
              <Input 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="rounded-xl border-border/40 text-sm font-medium h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sub-City / Woreda</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Sub-City"
                  value={formData.sub_city} 
                  onChange={(e) => setFormData({...formData, sub_city: e.target.value})}
                  className="rounded-xl border-border/40 text-sm font-medium h-11"
                />
                <Input 
                  placeholder="Woreda"
                  value={formData.woreda} 
                  onChange={(e) => setFormData({...formData, woreda: e.target.value})}
                  className="rounded-xl border-border/40 text-sm font-medium h-11"
                />
              </div>
            </div>
          </div>
          <Button 
            className="w-full h-11 rounded-xl font-bold uppercase tracking-widest gap-2"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />} 
            Commit Profile Changes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 shadow-sm rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-5 px-8 border-b border-border/40 bg-muted/10">
        <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-foreground/70">
          <User size={18} className="text-primary" /> Master Profile
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleStatus}
            disabled={updateMutation.isPending}
            className={cn(
              "rounded-xl h-8 text-[10px] font-black uppercase tracking-widest gap-2",
              customer.is_active ? "text-destructive hover:bg-destructive/5" : "text-emerald-600 hover:bg-emerald-50"
            )}
          >
           {customer.is_active ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
           {customer.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest gap-2 border-primary/20 text-primary hover:bg-primary/5"
          >
            <Edit3 size={14} /> Edit Identity
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Identity Core</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Legal Name</p>
                    <p className="text-sm font-bold text-foreground">{customer.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Communication Bridge</p>
                    <p className="text-sm font-bold text-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Contact Frequency</p>
                    <p className="text-sm font-bold text-foreground">{customer.phone || "No direct line linked"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Business Metadata</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Building size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Registered Organization</p>
                    <p className="text-sm font-bold text-foreground">{customer.company_name || "Personal Tier"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Fingerprint size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tax Identification (TIN)</p>
                    <p className="text-sm font-bold text-foreground font-mono">{customer.tin_number || "--- --- ---"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Logistics Coordinates</h4>
              <Card className="rounded-2xl border-border/40 bg-muted/5 shadow-none p-5 relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-primary mt-1" />
                    <div className="space-y-2">
                       <p className="text-sm font-bold leading-relaxed">
                         {customer.address_line1 || "No primary address recorded"}
                       </p>
                       <div className="flex flex-wrap gap-2">
                         <Badge variant="outline" className="text-[9px] font-bold border-border/40 uppercase tracking-tighter bg-background">
                            {customer.city || "Addis Ababa"}
                         </Badge>
                         {customer.sub_city && (
                           <Badge variant="outline" className="text-[9px] font-bold border-border/40 uppercase tracking-tighter bg-background">
                             Sub-City: {customer.sub_city}
                           </Badge>
                         )}
                         {customer.woreda && (
                           <Badge variant="outline" className="text-[9px] font-bold border-border/40 uppercase tracking-tighter bg-background">
                             Woreda: {customer.woreda}
                           </Badge>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
                <MapPin size={80} className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
              </Card>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">System Manifest</h4>
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                     <Calendar size={18} />
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-primary uppercase tracking-widest">Member Since</p>
                     <p className="text-sm font-bold text-foreground">
                       {format(new Date(customer.created_at || new Date()), "MMMM dd, yyyy")}
                     </p>
                   </div>
                </div>
                <Badge className={cn(
                  "rounded-full font-black uppercase tracking-widest text-[8px] px-3",
                  customer.is_active ? "bg-emerald-500" : "bg-destructive"
                )}>
                  {customer.is_active ? "Verified Account" : "Access Restricted"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
