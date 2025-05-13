"use client";

import { useEffect } from "react";
import Shake from "@shakebugs/browser";

const ShakeInitializer = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKey = process.env.NEXT_PUBLIC_SHAKE_API_KEY;

      if (!apiKey) {
        console.error(
          "Shake API Key not set. Add NEXT_PUBLIC_SHAKE_API_KEY to .env.local."
        );
        return;
      }

      try {
        Shake.start(apiKey);

        console.log("Shake started successfully.");
      } catch (error) {
        console.error("Error initializing Shake SDK:", error);
      }
    }
  }, []);

  return null;
};

export default ShakeInitializer;
