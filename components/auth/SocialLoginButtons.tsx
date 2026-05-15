"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

const providers = [
  { id: "google", label: "Google", icon: "..." },
  { id: "facebook", label: "Facebook", icon: "..." },
  { id: "tiktok", label: "TikTok", icon: "..." },
];

export function SocialLoginButtons({ callbackURL = "/account" }: { callbackURL?: string }) {
  const handleSocialLogin = async (provider: string) => {
    await signIn.social({ provider, callbackURL });
  };

  return (
    <div className="flex flex-col gap-3">
      {providers.map((p) => (
        <Button key={p.id} variant="outline" onClick={() => handleSocialLogin(p.id)}>
          {p.label}
        </Button>
      ))}
    </div>
  );
}
