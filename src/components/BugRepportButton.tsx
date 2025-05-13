// components/BugReportButton.js
"use client"; // Mark this component as a Client Component

import React, { useState } from "react";
import Shake from "@shakebugs/browser";
import { Button } from "./ui/button";
import { Flag } from "lucide-react";
import { toast } from "sonner";

// Helper to replace oklch(), oklab(), and gradients in multiple CSS properties with supported fallback
const replaceUnsupportedColors = (element: HTMLElement) => {
  const elements = element.querySelectorAll<HTMLElement>("*");
  elements.forEach((el) => {
    const style = getComputedStyle(el);
    // List of properties to check
    const props = [
      "backgroundColor",
      "color",
      "borderColor",
      "outlineColor",
      "boxShadow",
      "backgroundImage",
      "background"
    ];
    props.forEach((prop) => {
      const value = style[prop as keyof CSSStyleDeclaration] as string;
      if (value && /oklch|oklab/.test(value)) {
        // Fallback: use white for backgrounds, black for text, transparent for borders/shadows, none for images
        if (prop === "backgroundColor" || prop === "background") el.style.backgroundColor = "#fff";
        else if (prop === "color") el.style.color = "#000";
        else if (prop === "backgroundImage") el.style.backgroundImage = "none";
        else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          el.style[prop as any] = "transparent";
        }
      }
    });
  });
};

interface BugReportButtonProps {
  setIsReportingBug?: (open: boolean) => void;
}

const BugReportButton: React.FC<BugReportButtonProps> = ({ setIsReportingBug }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleReportBugClick = async () => {
    setIsLoading(true);
    try {
      if (typeof Shake !== "undefined") {
        if (setIsReportingBug) setIsReportingBug(true);
        Shake.setMetadata("url", window.location.href);
        replaceUnsupportedColors(document.body);
        await Shake.show();
        toast.success("Warbixinta bug-ga waa la bilaabay");
        // Try to detect when the modal is closed
        if (setIsReportingBug) {
          // Shake Web SDK does not provide a close event, so use a timeout as a fallback
          setTimeout(() => setIsReportingBug(false), 2000);
        }
      } else {
        console.warn("Shake SDK lama helin.");
        toast.error("Warbixinta bug-ga lama heli karo waqtigan");
      }
    } catch (error) {
      console.error("Khalad ayaa dhacay:", error);
      toast.error("Warbixinta bug-ga ma bilaaban");
      if (setIsReportingBug) setIsReportingBug(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        className="rounded-xl"
        variant={"outline"}
        onClick={handleReportBugClick}
        disabled={isLoading}
      >
        <Flag size={20} className={isLoading ? "animate-spin" : ""} />
      </Button>
    </div>
  );
};

export default BugReportButton;
