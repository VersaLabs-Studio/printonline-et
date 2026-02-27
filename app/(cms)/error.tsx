"use client";

import React from "react";
import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function CMSError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <ErrorFallback
        error={error}
        onReset={reset}
        title="CMS Interface Error"
        description="Something went wrong while loading the administration panel. Our engineers have been notified."
      />
    </div>
  );
}
