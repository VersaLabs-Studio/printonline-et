import React from "react";
import { CMSLayoutClient } from "./CMSLayoutClient";

export const metadata = {
  title: "CMS Admin | PrintOnline.et",
  description: "PrintOnline.et v2.0 Management System",
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return <CMSLayoutClient>{children}</CMSLayoutClient>;
}
