"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import ActivityProvider from "@/providers/ActivityProvider";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ActivityProvider>
            {children}
          </ActivityProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
