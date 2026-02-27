// app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content Card Wrapper */}
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-primary-foreground font-bold text-2xl italic">
                P
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                PrintOnline.et
              </span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">
                Pana Promotion
              </span>
            </div>
          </Link>
        </div>

        <div className="space-y-6">{children}</div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Pana Promotion. All rights reserved.
        </div>
      </div>
    </div>
  );
}
