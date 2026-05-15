"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  privacyPolicySchema,
  type PrivacyPolicyFormData,
} from "@/lib/validations/cms";
import {
  useCreatePrivacyPolicy,
  useUpdatePrivacyPolicy,
} from "@/hooks/data/usePrivacyPolicies";
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
import { Save } from "lucide-react";

interface PrivacyPolicyFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    content: string;
    policy_type: "privacy" | "terms" | "cookie";
    version: number;
    is_active: boolean;
    effective_date?: string;
  } | null;
}

export function PrivacyPolicyForm({
  isOpen,
  onClose,
  initialData,
}: PrivacyPolicyFormProps) {
  const createPolicy = useCreatePrivacyPolicy();
  const updatePolicy = useUpdatePrivacyPolicy();
  const isEditing = !!initialData;

  const form = useForm<PrivacyPolicyFormData>({
    resolver: zodResolver(privacyPolicySchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      policy_type: initialData?.policy_type || "privacy",
      version: initialData?.version || 1,
      is_active: initialData?.is_active ?? true,
      effective_date: initialData?.effective_date || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: initialData?.title || "",
        content: initialData?.content || "",
        policy_type: initialData?.policy_type || "privacy",
        version: initialData?.version || 1,
        is_active: initialData?.is_active ?? true,
        effective_date: initialData?.effective_date || "",
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: PrivacyPolicyFormData) => {
    if (isEditing && initialData) {
      updatePolicy.mutate(
        { id: initialData.id, ...values },
        { onSuccess: onClose }
      );
    } else {
      createPolicy.mutate(values, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Policy" : "New Policy"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="e.g. Privacy Policy"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="policy_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Policy Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="privacy">Privacy</SelectItem>
                          <SelectItem value="terms">Terms of Service</SelectItem>
                          <SelectItem value="cookie">Cookie Policy</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-tight">
                      Version
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="rounded-xl"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
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
              name="effective_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight">
                    Effective Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-tight">
                    Content (Markdown)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write the policy content in markdown..."
                      className="rounded-xl resize-none min-h-[200px] font-mono text-sm"
                      rows={12}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={createPolicy.isPending || updatePolicy.isPending}
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
