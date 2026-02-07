"use client";


import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { swrConfig } from "@/hooks/useApi";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <PostHogProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </PostHogProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
