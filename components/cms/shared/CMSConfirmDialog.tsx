"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CMSConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
}

export function CMSConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record from our servers.",
  confirmLabel = "Delete Record",
  cancelLabel = "Cancel",
  variant = "destructive",
}: CMSConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl border-border/40 shadow-2xl">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="text-destructive" size={24} />
          </div>
          <AlertDialogTitle className="text-center font-black uppercase tracking-tight text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center font-medium leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-6"
            >
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-destructive/20"
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
            >
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
