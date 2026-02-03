"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { swrConfig } from "@/hooks/useApi";
import { PostHogProvider } from "@/providers/PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SWRConfig value={swrConfig}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <PostHogProvider>
              {children}
            </PostHogProvider>
          </ThemeProvider>
        </SWRConfig>
      </PersistGate>
    </Provider>
  );
}
