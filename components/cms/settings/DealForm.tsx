"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  homepageDealSchema,
  type HomepageDealFormData,
} from "@/lib/validations/cms";
import {
  useCreateDeal,
  useUpdateDeal,
} from "@/hooks/data/useDeals";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface DealFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image_url?: string;
    badge_text?: string;
    badge_color?: string;
    link_url?: string;
    link_text?: string;
    countdown_label?: string;
    display_order: number;
    is_active: boolean;
  } | null;
}

const BADGE_COLORS = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
];

const COLOR_SWATCHES: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
};

export function DealForm({
  isOpen,
  onClose,
  initialData,
}: DealFormProps) {
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  const isEditing = !!initialData;

  const form = useForm<HomepageDealFormData>({
    resolver: zodResolver(homepageDealSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      image_url: initialData?.image_url || "",
      badge_text: initialData?.badge_text || "",
      badge_color: initialData?.badge_color || "red",
      link_url: initialData?.link_url || "",
      link_text: initialData?.link_text || "View Offer",
      countdown_label: initialData?.countdown_label || "",
      display_order: initialData?.display_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        description: initialData?.description || "",
        image_url: initialData?.image_url || "",
        badge_text: initialData?.badge_text || "",
        badge_color: initialData?.badge_color || "red",
        link_url: initialData?.link_url || "",
        link_text: initialData?.link_text || "View Offer",
        countdown_label: initialData?.countdown_label || "",
        display_order: initialData?.display_order || 0,
        is_active: initialData?.is_active ?? true,
      });
    }
  }, [isOpen, initialData, form]);

  const selectedColor = form.watch("badge_color");
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "deals");

      const res = await fetch("/api/upload/site-images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error || "Upload failed");
        return;
      }

      const json = await res.json();
      form.setValue("image_url", json.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: HomepageDealFormData) => {
    if (isEditing && initialData) {
      updateDeal.mutate(
        { id: initialData.id, ...values },
        { onSuccess: onClose }
      );
    } else {
      createDeal.mutate(values, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Deal" : "New Deal"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Summer Sale"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Subtitle
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Limited time offer"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the deal..."
                      className="rounded-xl resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight">
                    Image URL
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="https://example.com/deal-image.jpg"
                        className="rounded-xl flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl h-10 gap-2 shrink-0"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      {uploading ? "..." : "Upload"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="badge_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Badge Text
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Limited"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="badge_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Badge Color
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {BADGE_COLORS.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-3 h-3 rounded-full ${COLOR_SWATCHES[color.value]}`}
                                  />
                                  {color.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span
                          className={`w-5 h-5 rounded-full ${COLOR_SWATCHES[selectedColor] || "bg-red-500"}`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="link_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Link URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/all-products"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Link Text
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="View Offer"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="countdown_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Countdown Label
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Offer ends in"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Display Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="rounded-xl"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight cursor-pointer">
                    Active
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-10 font-bold uppercase tracking-widest text-[10px] px-6"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl h-10 font-bold uppercase tracking-widest text-[10px] px-6 gap-2"
                disabled={createDeal.isPending || updateDeal.isPending}
              >
                <Save size={14} />
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
