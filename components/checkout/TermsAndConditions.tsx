import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface TermsAndConditionsProps {
  content: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function TermsAndConditions({
  content,
  checked,
  onCheckedChange,
}: TermsAndConditionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-start space-x-3 p-4 bg-muted/20 border border-border/40 rounded-xl">
      <input
        type="checkbox"
        id="terms"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          I accept the terms and conditions
        </label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.{" "}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-primary hover:underline font-bold focus:outline-none"
              >
                Read terms
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md sm:max-w-2xl h-[80vh] flex flex-col p-0">
              <DialogHeader className="px-6 py-4 border-b border-border/40">
                <DialogTitle className="font-black uppercase tracking-widest">
                  Terms & Conditions
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 p-6">
                <article className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </article>
              </ScrollArea>
              <div className="p-4 border-t border-border/40 bg-muted/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onCheckedChange(true);
                    setOpen(false);
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg uppercase tracking-wider text-xs"
                >
                  I Agree
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </div>
  );
}
