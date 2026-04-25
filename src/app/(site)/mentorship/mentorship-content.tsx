"use client";

import { useEffect, useState } from "react";

export function MentorshipContent() {
  const [CalComponent, setCalComponent] = useState<React.ComponentType<{
    calLink: string;
    styles?: Record<string, string | number>;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@calcom/embed-react").then((mod) => {
      setCalComponent(() => mod.default);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !CalComponent) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading booking...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Isdiiwi / Assessment
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Doorso khadka hoose si aad u ballaariso anshexinaad la tixgeliyo.
        </p>
      </div>
      <div className="flex justify-center px-4">
        <div style={{ width: "100%", maxWidth: "900px", height: "700px" }}>
          <CalComponent calLink="garaad/" styles={{ height: "100%", width: "100%", border: "none" }} />
        </div>
      </div>
    </main>
  );
}