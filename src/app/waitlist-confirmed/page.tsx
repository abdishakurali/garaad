"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Share2 } from "lucide-react";

export default function WaitlistConfirmedPage() {
  const searchParams = useSearchParams();
  const position = searchParams.get("position") || "N/A";
  const phone = searchParams.get("phone") || "";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://garaad.org";

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Garaad STEM",
        text: `Waxaan ku biiray liiska sugitaanka Garaad Challenge! Adiguna ku biir si aad u noqoto Full-Stack Developer.`,
        url: shareUrl,
      });
    } catch (e) {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert("Link-ga waa la nuqulay!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-violet-600 text-white shadow-2xl shadow-violet-500/40">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Waad ku mahadsantahay!
          </h1>
          <p className="text-muted-foreground text-lg">
            Waan ku diiwaangelinay liiska sugitaanka Garaad Challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl border border-border bg-card flex flex-col items-center justify-center space-y-2">
            <Users className="h-6 w-6 text-violet-500 mb-1" />
            <span className="text-sm text-muted-foreground font-medium">Booskaaga</span>
            <span className="text-3xl font-black tabular-nums">{position}</span>
          </div>
          <div className="p-6 rounded-3xl border border-border bg-card flex flex-col items-center justify-center space-y-2">
            <MessageCircle className="h-6 w-6 text-violet-500 mb-1" />
            <span className="text-sm text-muted-foreground font-medium">WhatsApp-kaaga</span>
            <span className="text-lg font-bold tabular-nums">{phone}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-sm font-medium">
          Waan ku soo wargelin doonaa isla marka kooxda xigta la furo. Fadlan isha ku hay email-kaaga iyo WhatsApp-kaaga.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-muted"
          >
            <Share2 className="h-5 w-5" />
            La wadaag saaxiibadaa
          </Button>
        </div>
      </div>
    </div>
  );
}
