"use client";

import React from "react";
import Link from "next/link";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/data/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Settings, DollarSign, Truck, Globe, Image, Sparkles, Quote, ShieldCheck, ChevronRight, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SiteSetting } from "@/hooks/data/useSettings";

const categoryIcons: Record<string, React.ElementType> = {
  pricing: DollarSign,
  delivery: Truck,
  general: Globe,
  designer: Settings,
};

const categoryLabels: Record<string, string> = {
  pricing: "Pricing Configuration",
  delivery: "Delivery Settings",
  general: "General Settings",
  designer: "Designer Settings",
};

export function SettingsPage() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [localValues, setLocalValues] = React.useState<
    Record<string, unknown>
  >({});

  React.useEffect(() => {
    if (settings) {
      const values: Record<string, unknown> = {};
      for (const s of settings) {
        values[s.setting_key] = s.setting_value;
      }
      setLocalValues(values);
    }
  }, [settings]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    );
  }

  const grouped = (settings ?? []).reduce<
    Record<string, SiteSetting[]>
  >((acc, setting) => {
    const cat = setting.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {});

  const handleSave = (setting: SiteSetting) => {
    const value = localValues[setting.setting_key];
    updateSetting.mutate({
      setting_key: setting.setting_key,
      setting_value: value,
    });
  };

  const renderField = (setting: SiteSetting) => {
    const value = localValues[setting.setting_key];

    switch (setting.data_type) {
      case "number":
        return (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              className="rounded-xl w-40"
              value={String(value ?? "")}
              onChange={(e) =>
                setLocalValues((prev) => ({
                  ...prev,
                  [setting.setting_key]: parseFloat(e.target.value) || 0,
                }))
              }
            />
            <Button
              size="sm"
              className="h-9 rounded-xl font-bold uppercase tracking-widest text-[10px] px-4 gap-1.5"
              onClick={() => handleSave(setting)}
              disabled={updateSetting.isPending}
            >
              <Save size={12} />
              Save
            </Button>
          </div>
        );
      case "text":
        return (
          <div className="flex items-center gap-3">
            <Input
              className="rounded-xl w-64"
              value={String(value ?? "")}
              onChange={(e) =>
                setLocalValues((prev) => ({
                  ...prev,
                  [setting.setting_key]: e.target.value,
                }))
              }
            />
            <Button
              size="sm"
              className="h-9 rounded-xl font-bold uppercase tracking-widest text-[10px] px-4 gap-1.5"
              onClick={() => handleSave(setting)}
              disabled={updateSetting.isPending}
            >
              <Save size={12} />
              Save
            </Button>
          </div>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={!!value}
              onCheckedChange={(checked) => {
                setLocalValues((prev) => ({
                  ...prev,
                  [setting.setting_key]: checked,
                }));
                updateSetting.mutate({
                  setting_key: setting.setting_key,
                  setting_value: checked,
                });
              }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {value ? "Enabled" : "Disabled"}
            </span>
          </div>
        );
      case "json":
        return (
          <div className="flex items-start gap-3 w-full max-w-xl">
            <Textarea
              className="rounded-xl min-h-[80px] font-mono text-xs resize-none"
              value={
                typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2)
              }
              onChange={(e) =>
                setLocalValues((prev) => ({
                  ...prev,
                  [setting.setting_key]: e.target.value,
                }))
              }
            />
            <Button
              size="sm"
              className="h-9 rounded-xl font-bold uppercase tracking-widest text-[10px] px-4 gap-1.5 mt-1"
              onClick={() => handleSave(setting)}
              disabled={updateSetting.isPending}
            >
              <Save size={12} />
              Save
            </Button>
          </div>
        );
      default:
        return (
          <span className="text-sm text-muted-foreground">
            Unknown type: {setting.data_type}
          </span>
        );
    }
  };

  const settingsNavItems = [
    {
      section: "Homepage & Content",
      icon: Globe,
      items: [
        { label: "Hero Slides", description: "Manage homepage hero slideshow (max 4 slides)", href: "/cms/settings/hero", icon: Image },
        { label: "Special Deals", description: "Manage homepage promotional deals (max 3)", href: "/cms/settings/deals", icon: Sparkles },
        { label: "Testimonials", description: "Manage customer testimonials", href: "/cms/settings/testimonials", icon: Quote },
        { label: "Homepage Categories", description: "Control which categories appear on the homepage", href: "/cms/settings/homepage-categories", icon: LayoutGrid },
      ],
    },
    {
      section: "Compliance & Legal",
      icon: ShieldCheck,
      items: [
        { label: "Privacy Policies", description: "Manage privacy, terms, and cookie policies", href: "/cms/settings/privacy", icon: ShieldCheck },
      ],
    },
    {
      section: "Delivery",
      icon: Truck,
      items: [
        { label: "Delivery Zones", description: "Manage delivery zones and pricing", href: "/cms/settings/delivery", icon: Truck },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categorySettings]) => {
        const Icon = categoryIcons[category] || Settings;
        return (
          <Card
            key={category}
            className="rounded-2xl border-border/40 shadow-sm"
          >
            <CardHeader className="border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                <Icon size={16} className="text-primary" />
                {categoryLabels[category] || category}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {categorySettings.map((setting) => (
                <div
                  key={setting.setting_key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {setting.label}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[8px] uppercase tracking-widest font-mono"
                      >
                        {setting.setting_key}
                      </Badge>
                    </div>
                    {setting.description && (
                      <p className="text-xs text-muted-foreground font-medium">
                        {setting.description}
                      </p>
                    )}
                  </div>
                  {renderField(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {settingsNavItems.map((section) => {
        const SectionIcon = section.icon;
        return (
          <Card
            key={section.section}
            className="rounded-2xl border-border/40 shadow-sm"
          >
            <CardHeader className="border-b border-border/40 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                <SectionIcon size={16} className="text-primary" />
                {section.section}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {section.items.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors ${
                      idx < section.items.length - 1 ? "border-b border-border/20" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ItemIcon size={16} className="text-muted-foreground" />
                      <div>
                        <span className="text-sm font-bold">{item.label}</span>
                        <p className="text-xs text-muted-foreground font-medium">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
