// components/BugReportButton.js
"use client"; // Mark this component as a Client Component

import React from "react";
import Shake from "@shakebugs/browser";
import { Button } from "./ui/button";
import { Bug, Flag } from "lucide-react";

const BugReportButton = () => {
  const handleReportBugClick = () => {
    // Ensure Shake is loaded before attempting to trigger
    if (typeof Shake !== "undefined") {
      try {
        // Trigger the Shake bug reporting flow
        // The method name might be triggerBugReporting() or show()
        // Refer to the latest Shake web SDK documentation for the exact method
        Shake.show();

        console.log("Shake bug reporting triggered");
      } catch (error) {
        console.error("Error triggering Shake:", error);
        // Handle cases where Shake might not be fully initialized or available
      }
    } else {
      console.warn("Shake SDK not loaded.");
    }
  };

  return (
    <div>
      <Button
        className="rounded-xl"
        variant={"outline"}
        onClick={handleReportBugClick}
      >
        <Flag size={20} />
      </Button>
    </div>
  );
};

export default BugReportButton;
