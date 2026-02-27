import React from "react";
import { LoadingState } from "@/components/shared/LoadingState";

export default function CMSLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingState message="Loading CMS data..." variant="admin" />
    </div>
  );
}
