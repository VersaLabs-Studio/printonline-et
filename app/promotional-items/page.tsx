// app/promotional-items/page.tsx
import { redirect } from "next/navigation";

export default function PromotionalItemsPage() {
  redirect("/all-products?category=gifts-packaging");
}
