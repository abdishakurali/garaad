"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const CHATBASE_SRC = "https://www.chatbase.co/chatbot-iframe/jgcH6K1Ng1Mh3Pw9Gn3gq";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  // Esc safety: Radix handles this, but we keep focus stable.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-[140] bottom-5 right-5 sm:bottom-6 sm:right-6",
          "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
          "hover:brightness-110 active:scale-[0.98] transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          "ring-offset-background"
        )}
        aria-label="Furo caawiyaha (chat)"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 mx-auto" strokeWidth={2} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className={cn(
            "p-0 w-[100vw] sm:w-[420px] md:w-[480px]",
            "bg-background border-l border-border"
          )}
        >
          <div className="h-[100dvh] flex flex-col">
            <div className="px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground leading-tight">Caawiye</p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    Weydii su’aal ku saabsan casharrada ama koorsooyinka.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-muted/20">
              <iframe
                src={CHATBASE_SRC}
                title="Garaad Chatbot"
                width="100%"
                height="100%"
                style={{ height: "100%", minHeight: 700 }}
                frameBorder={0}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

