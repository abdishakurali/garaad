import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Waxaan isticmaalnaa cookies si aan u hagaajino waayo aragnimadaada Garaad{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Wax badan ka baro siyaasadda cookies-ka iyo dejinta
          </a>
          .
        </p>

        <Button
          onClick={() => setIsVisible(false)}
          className="whitespace-nowrap"
        >
          Aqbal
        </Button>
      </div>
    </div>
  );
}
