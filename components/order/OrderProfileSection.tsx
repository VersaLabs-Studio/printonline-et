"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  ShieldCheck,
  MapPin,
  MapPinPlus,
  Truck,
  Pencil,
  ArrowRight,
  Store,
  Save,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations";
import { DELIVERY_ZONES, getDeliveryZone, FREE_DELIVERY_THRESHOLD, getQuantityMultiplier } from "@/lib/delivery/zones";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

const SUB_CITIES = DELIVERY_ZONES.map((z) => z.subCity);

interface OrderProfileSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: Record<string, any> | null;
  deliveryMethod: string;
  setDeliveryMethod: (val: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (val: string) => void;
  onNext: () => void;
  onProfileUpdate: (updated: Record<string, unknown>) => void;
  onSubCityChange: (subCity: string | null) => void;
  onAlternateAddressChange?: (addr: Record<string, string>) => void;
  cartTotal: number;
  cartCount: number;
}

export function OrderProfileSection({
  profile,
  session,
  deliveryMethod,
  setDeliveryMethod,
  specialInstructions,
  setSpecialInstructions,
  onNext,
  onProfileUpdate,
  onSubCityChange,
  onAlternateAddressChange,
  cartTotal,
  cartCount,
}: OrderProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Alternate address state
  const [altAddress, setAltAddress] = useState("");
  const [altAddressLine2, setAltAddressLine2] = useState("");
  const [altSubCity, setAltSubCity] = useState("");
  const [altWoreda, setAltWoreda] = useState("");
  const [altRecipientName, setAltRecipientName] = useState("");
  const [altPhone, setAltPhone] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile?.full_name || session?.user?.name || "",
      phone: profile?.phone || "",
      tinNumber: profile?.tin_number || "",
      companyName: profile?.company_name || "",
      addressLine1: profile?.address_line1 || "",
      addressLine2: profile?.address_line2 || "",
      city: profile?.city || "Addis Ababa",
      subCity: profile?.sub_city || "",
      woreda: profile?.woreda || "",
    },
  });

  const watchedSubCity = watch("subCity");
  const watchedAddress = watch("addressLine1");

  // The effective sub-city for delivery fee calculation
  const effectiveSubCity = deliveryMethod === "other" ? altSubCity : watchedSubCity;

  // Live delivery preview — mirrors calculateDeliveryFee logic
  const zone = effectiveSubCity ? getDeliveryZone(effectiveSubCity) : null;
  const isFree = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const baseFee = zone?.baseFee ?? 0;
  const quantityMultiplier = getQuantityMultiplier(cartCount);
  const quantityDiscount = baseFee - baseFee * quantityMultiplier;
  const liveDeliveryFee = isFree ? 0 : baseFee * quantityMultiplier;

  const handleSave = useCallback(
    async (values: ProfileUpdateInput) => {
      setIsSaving(true);
      try {
        const res = await fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: values.name,
            phone: values.phone || null,
            tin_number: values.tinNumber || null,
            company_name: values.companyName || null,
            address_line1: values.addressLine1 || null,
            address_line2: values.addressLine2 || null,
            city: values.city || "Addis Ababa",
            sub_city: values.subCity || null,
            woreda: values.woreda || null,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update profile");
        }

        // Sync with parent
        onProfileUpdate({
          ...profile,
          full_name: values.name,
          phone: values.phone || null,
          tin_number: values.tinNumber || null,
          company_name: values.companyName || null,
          address_line1: values.addressLine1 || null,
          address_line2: values.addressLine2 || null,
          city: values.city || "Addis Ababa",
          sub_city: values.subCity || null,
          woreda: values.woreda || null,
        });

        // Sync sub-city to delivery context
        onSubCityChange(values.subCity || null);

        toast.success("Profile updated and synced!");
        setIsEditing(false);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to save profile");
      } finally {
        setIsSaving(false);
      }
    },
    [onProfileUpdate, onSubCityChange, profile]
  );

  const handleSubCitySelect = (val: string) => {
    setValue("subCity", val, { shouldDirty: true });
    onSubCityChange(val || null);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 shadow-sm relative overflow-hidden">
      <div className="space-y-1 relative z-10">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          Step 1 of 2
        </h3>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight uppercase flex items-center gap-3">
          <ShieldCheck className="text-primary" size={24} /> Account & Delivery
        </h2>
      </div>

      {/* Contact Details */}
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60 flex items-center gap-2">
            <User size={14} /> Contact Details
          </h4>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-[10px] font-semibold uppercase tracking-widest text-primary hover:bg-primary/5"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={12} className="mr-1.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-[10px] font-semibold uppercase tracking-widest"
                onClick={() => setIsEditing(false)}
              >
                <X size={12} className="mr-1.5" /> Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-[10px] font-semibold uppercase tracking-widest btn-pana"
                disabled={!isDirty || isSaving}
                onClick={handleSubmit(handleSave)}
              >
                {isSaving ? (
                  <Loader2 size={12} className="mr-1.5 animate-spin" />
                ) : (
                  <Save size={12} className="mr-1.5" />
                )}
                Save
              </Button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="p-6 rounded-2xl bg-muted/5 border border-border/40 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
                Full Name
              </p>
              <p className="text-sm font-semibold tracking-tight">
                {profile?.full_name || session?.user?.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
                Email Address
              </p>
              <p className="text-sm font-semibold tracking-tight">
                {session?.user?.email}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
                Phone Number
              </p>
              <p className="text-sm font-semibold tracking-tight">
                {profile?.phone || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
                TIN Number
              </p>
              <p className="text-sm font-semibold tracking-tight">
                {profile?.tin_number || "Not provided"}
              </p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50 tracking-wider">
                Shipping Address
              </p>
              <p className="text-sm font-semibold tracking-tight">
                {profile?.address_line1
                  ? `${profile.address_line1}${profile.address_line2 ? `, ${profile.address_line2}` : ""}`
                  : "Not provided"}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.city}
                {profile?.sub_city ? `, ${profile.sub_city}` : ""}
                {profile?.woreda ? ` (Woreda ${profile.woreda})` : ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-muted/5 border border-border/40 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Full Name</Label>
                <Input {...register("name")} className={errors.name ? "border-red-500" : ""} />
                {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Phone</Label>
                <Input {...register("phone")} placeholder="0911..." className={errors.phone ? "border-red-500" : ""} />
                {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">TIN Number</Label>
                <Input {...register("tinNumber")} placeholder="1234567890" className={errors.tinNumber ? "border-red-500" : ""} />
                {errors.tinNumber && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.tinNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Company (Optional)</Label>
                <Input {...register("companyName")} placeholder="Pana PLC" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider">Address Line 1</Label>
              <Input {...register("addressLine1")} placeholder="Bole Road, Around Edna Mall" className={errors.addressLine1 ? "border-red-500" : ""} />
              {errors.addressLine1 && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.addressLine1.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider">Address Line 2 (Optional)</Label>
              <Input {...register("addressLine2")} placeholder="Building Name, Floor, Office No." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">City</Label>
                <Input value="Addis Ababa" readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Sub-City</Label>
                <Select
                  onValueChange={handleSubCitySelect}
                  value={watch("subCity") || undefined}
                >
                  <SelectTrigger className={errors.subCity ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Sub-City" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUB_CITIES.map((sc) => (
                      <SelectItem key={sc} value={sc}>
                        {sc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subCity && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.subCity.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Woreda (Optional)</Label>
                <Input {...register("woreda")} placeholder="03" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              Changes are saved to your profile at <Link href="/account" className="text-primary hover:underline">/account</Link>.
            </p>
          </div>
        )}
      </div>

      {/* Delivery Preferences */}
      <div className="space-y-4 pt-4 border-t border-border/40 relative z-10">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground opacity-60 flex items-center gap-2 mb-2">
          <Truck size={14} /> Delivery Preferences
        </h4>

        <RadioGroup
          value={deliveryMethod}
          onValueChange={(val) => {
            setDeliveryMethod(val);
            if (val === "pickup") {
              onSubCityChange(null);
            } else if (val === "other") {
              onSubCityChange(altSubCity || null);
            } else {
              onSubCityChange(watchedSubCity || null);
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="relative">
            <RadioGroupItem value="home" id="home" className="peer sr-only" />
            <Label
              htmlFor="home"
              className="flex flex-col p-5 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/30 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-2 h-full"
            >
              <div className="flex items-center gap-2 pb-2">
                <Truck className="text-emerald-500" size={18} />
                <span className="font-semibold tracking-tight uppercase text-sm">
                  My Address
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-2">
                {watchedAddress
                  ? `${watchedAddress}${profile?.address_line2 ? `, ${profile.address_line2}` : ""}`
                  : "No address set. Edit your profile above."}
              </p>
              <div className="mt-auto pt-2 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-60">
                  {watchedSubCity
                    ? `Addis Ababa, ${watchedSubCity}`
                    : "Sub-city not selected"}
                </p>
                {/* Live delivery fee preview */}
                {deliveryMethod === "home" && watchedSubCity && (
                  <div className="space-y-1">
                    {isFree ? (
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">
                        Free delivery (order over {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB)
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-foreground uppercase">
                            Delivery Fee:
                          </span>
                          <PriceDisplay amount={liveDeliveryFee} size="sm" className="font-bold" />
                        </div>
                        {/* Breakdown */}
                        <div className="text-[10px] text-muted-foreground uppercase space-x-1">
                          <span>Base {baseFee} ETB</span>
                          {quantityDiscount > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-500">
                                -{quantityDiscount} ETB bulk discount ({cartCount} items)
                              </span>
                            </>
                          )}
                          <span>·</span>
                          <span>({zone?.description})</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="other" id="other" className="peer sr-only" />
            <Label
              htmlFor="other"
              className="flex flex-col p-5 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/30 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-2 h-full"
            >
              <div className="flex items-center gap-2 pb-2">
                <MapPinPlus className="text-blue-500" size={18} />
                <span className="font-semibold tracking-tight uppercase text-sm">
                  Another Address
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Deliver to a one-time address different from your account address
              </p>
              <div className="mt-auto pt-2">
                {deliveryMethod === "other" && altSubCity ? (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Addis Ababa, {altSubCity}
                  </p>
                ) : (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-60">
                    Enter address below
                  </p>
                )}
              </div>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem
              value="pickup"
              id="pickup"
              className="peer sr-only"
            />
            <Label
              htmlFor="pickup"
              className="flex flex-col p-5 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/30 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-2 h-full"
            >
              <div className="flex items-center gap-2 pb-2">
                <Store className="text-amber-500" size={18} />
                <span className="font-semibold tracking-tight uppercase text-sm">
                  Office Pickup
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Pick up from our printing workshop when your order is ready
              </p>
              <div className="mt-auto pt-2 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground opacity-60">
                  Pana Promotion PLC, Addis Ababa, Bole Sub City, Woreda 03,
                  Wakero Building
                </p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">
                  Free — 0 ETB
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Alternate Address Form — shown only when 'other' is selected */}
        {deliveryMethod === "other" && (
          <div className="p-6 rounded-2xl bg-muted/5 border border-border/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <MapPinPlus size={12} /> One-Time Delivery Address
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Recipient Name *</Label>
                <Input
                  value={altRecipientName}
                  onChange={(e) => setAltRecipientName(e.target.value)}
                  placeholder="Full name of recipient"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Phone *</Label>
                <Input
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="0911..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider">Address Line 1 *</Label>
              <Input
                value={altAddress}
                onChange={(e) => setAltAddress(e.target.value)}
                placeholder="Bole Road, Around Edna Mall"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider">Address Line 2 (Optional)</Label>
              <Input
                value={altAddressLine2}
                onChange={(e) => setAltAddressLine2(e.target.value)}
                placeholder="Building Name, Floor, Office No."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">City</Label>
                <Input value="Addis Ababa" readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Sub-City *</Label>
                <Select
                  onValueChange={(val) => {
                    setAltSubCity(val);
                    onSubCityChange(val || null);
                    onAlternateAddressChange?.({
                      altAddress, altAddressLine2, altSubCity: val, altWoreda, altRecipientName, altPhone,
                    });
                  }}
                  value={altSubCity || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub-City" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUB_CITIES.map((sc) => (
                      <SelectItem key={sc} value={sc}>
                        {sc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider">Woreda (Optional)</Label>
                <Input
                  value={altWoreda}
                  onChange={(e) => setAltWoreda(e.target.value)}
                  placeholder="03"
                />
              </div>
            </div>

            {/* Live delivery fee for alternate address */}
            {altSubCity && (
              <div className="pt-2 space-y-1">
                {isFree ? (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">
                    Free delivery (order over {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB)
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-foreground uppercase">
                      Delivery Fee:
                    </span>
                    <PriceDisplay amount={liveDeliveryFee} size="sm" className="font-bold" />
                    <span className="text-[10px] text-muted-foreground uppercase">({zone?.description})</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-[10px] text-muted-foreground italic">
              This address is used only for this order and is not saved to your account profile.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-border/40 relative z-10">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          Special Instructions
        </Label>
        <Textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="min-h-[80px] rounded-2xl bg-muted/5 border-border/40 font-medium resize-none p-4"
          placeholder="Any special requirements for production or delivery..."
        />
      </div>

      <div className="pt-2 flex gap-4 relative z-10">
        <Button
          onClick={() => {
            if (deliveryMethod === "home" && !watchedAddress) {
              toast.error(
                "Please add a shipping address, or select pickup.",
              );
            } else if (deliveryMethod === "home" && !watchedSubCity) {
              toast.error(
                "Please select a sub-city for delivery fee calculation.",
              );
            } else if (deliveryMethod === "other") {
              if (!altAddress) {
                toast.error("Please enter the delivery address.");
                return;
              }
              if (!altSubCity) {
                toast.error("Please select a sub-city for the alternate address.");
                return;
              }
              if (!altRecipientName) {
                toast.error("Please enter the recipient name.");
                return;
              }
              if (!altPhone) {
                toast.error("Please enter the recipient phone number.");
                return;
              }
              // Sync alternate address to cart context
              onAlternateAddressChange?.({
                altAddress, altAddressLine2, altSubCity, altWoreda, altRecipientName, altPhone,
              });
              onNext();
            } else {
              onNext();
            }
          }}
          className="flex-1 btn-pana py-4 text-sm font-semibold uppercase tracking-wider w-full gap-3 active:scale-[0.98]"
        >
          Review Order
          <ArrowRight
            size={18}
            className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>
  );
}
