"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, BookOpen, Loader2, CheckCircle } from "lucide-react";
import { usePostHog } from "posthog-js/react";

export default function PostVerificationChoicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [choice, setChoice] = useState<"assessment" | "courses" | null>(null);
  const router = useRouter();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("post_verification_choice_page_viewed");
  }, [posthog]);

  const handleChoice = async (selectedChoice: "assessment" | "courses") => {
    setIsLoading(true);
    setChoice(selectedChoice);

    posthog?.capture("post_verification_choice_selected", {
      choice: selectedChoice,
    });

    if (selectedChoice === "courses") {
      router.push("/courses");
    } else {
      // For assessment, we'll redirect to a booking/mentorship page
      // This could be /mentorship or a dedicated booking page
      router.push("/mentorship");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Email-kaaga waa la xaqiijiyay!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Ku soo dhowow Garaad! Waxaad dooran kartaa sidii aad u bilaabi laatid barashadaada.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-4">
            {/* Assessment/Booking Option */}
            <button
              onClick={() => handleChoice("assessment")}
              disabled={isLoading}
              className="group flex items-start gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                {isLoading && choice === "assessment" ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <Calendar className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 text-lg">
                  I yo / Waan qaado anshexinaad
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  La tago macallin ama koox isbarbaro ah si aad u hesho taageero shakhsiga. Waxaad baran doontaa sida loo sameeyo mashaariic real.
                </p>
              </div>
            </button>

            {/* Courses Option */}
            <button
              onClick={() => handleChoice("courses")}
              disabled={isLoading}
              className="group flex items-start gap-4 p-6 rounded-xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                {isLoading && choice === "courses" ? (
                  <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                ) : (
                  <BookOpen className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 text-lg">
                  Bilow baraashada
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Ku bilow barashada mawduuca. Faa iidana soo koobi dhigma ama ku raaci koorsada.
                </p>
              </div>
            </button>
          </div>
        </CardContent>

        <CardFooter className="justify-center pt-2">
          <p className="text-sm text-slate-500 text-center">
            Waxaad dooran kartaa go a kasta markii aad rabto.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}