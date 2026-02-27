// app/digital-paper-prints/page.tsx
// Legacy route — redirect to unified products page
import { redirect } from "next/navigation";

export default function DigitalPaperPrintsPage() {
  redirect("/all-products?category=business-essentials");
}
