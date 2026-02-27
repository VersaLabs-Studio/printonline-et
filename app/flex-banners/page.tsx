// app/flex-banners/page.tsx
import { redirect } from "next/navigation";

export default function FlexBannersPage() {
  redirect("/all-products?category=marketing-materials");
}
