"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChevronRight,
  Check,
  Share2,
  MessageCircle,
  Mail,
  Smartphone,
  X,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AuthService from "@/services/auth";
import { Button } from "./ui/button";

interface ShareLessonProps {
  lessonTitle: string;
  courseName: string;
  onContinue: () => void;
  lessonId: string;
  courseId: string;
}

const ShareLesson: React.FC<ShareLessonProps> = ({
  lessonTitle,
  courseName,
  onContinue,
  lessonId,
  courseId,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const storedUser = AuthService.getInstance().getCurrentUser();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/courses/${courseId}/lessons/${lessonId}`
      : "";

  const shareText = `${storedUser.first_name} wuxuu dhamaystiray casharkan "${lessonTitle}" ee kooraska "${courseName}"  Waxaad casharkan ka daawan kartaa: www.garaad.org/courses/${courseId}/lessons/${lessonId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast.success("Linkiga waa la koobiyeeyay!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Ma awoodin in la koopiyo linkiga");
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      let shareUrl = "";

      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(
            `${shareText} ${shareUrl}`
          )}`;
          break;
        case "sms":
          shareUrl = `sms:?body=${encodeURIComponent(
            `${shareText} ${shareUrl}`
          )}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${encodeURIComponent(
            `${courseName} - ${lessonTitle}`
          )}&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: `${courseName} - ${lessonTitle}`,
              text: shareText,
              url: shareUrl,
            });
            toast.success("Waad la wadaagtay!");
            return;
          } else {
            await handleCopyLink();
            return;
          }
      }

      window.open(shareUrl, "_blank");
      toast.success("Waad la wadaagtay!");
    } catch (err) {
      toast.error("Ma awoodin in la wadaago");
      console.error("Failed to share:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden border-0 shadow-2xl relative">
          <button
            onClick={onContinue}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <CardContent className="p-0">
            <div className="bg-purple-200 p-8 text-black relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-purple-600/20" />

              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <span className="text-sm font-light opacity-90">
                      • {storedUser.first_name} {storedUser.last_name}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-[80%]">
                      Casharkaan waa kuu dhamaaday! 🎉
                    </h1>

                    <div className="flex items-center gap-6">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">{courseName}</h2>
                        <p className="text-lg opacity-90">{lessonTitle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Image
                    src="/favicon.ico"
                    alt="Course icon"
                    width={100}
                    height={100}
                    className="rounded-2xl border-4 border-white/20"
                  />
                </motion.div>
              </div>
            </div>

            {/* Sharing section */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  La wadaag saaxiibada
                </h3>
                <Share2 className="text-gray-600" />
              </div>

              <div className="space-y-4">
                <div
                  className={cn(
                    "p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-600 transition-all cursor-pointer",
                    expanded ? "max-h-96" : "max-h-24"
                  )}
                  onClick={() => setExpanded(!expanded)}
                >
                  <p
                    className={cn(
                      "transition-all",
                      !expanded && "line-clamp-2"
                    )}
                  >
                    {shareText}
                  </p>
                  {!expanded && (
                    <span className="text-sm text-purple-600 mt-1 block">
                      Riix si aad u buuxiso
                    </span>
                  )}
                </div>

                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="p-4 bg-white rounded-xl border border-gray-200 w-full flex items-center justify-center gap-2"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-6 w-6 text-green-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Share2 className="h-6 w-6 text-purple-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="text-sm font-medium">
                      {copied ? "Koobiyey" : "Koobi Link"}
                    </span>
                  </motion.button>
                </div>

                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("whatsapp")}
                    className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-purple-500"
                  >
                    <MessageCircle className="h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("sms")}
                    className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-purple-500"
                  >
                    <Smartphone className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">SMS</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("email")}
                    className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-purple-500"
                  >
                    <Mail className="h-6 w-6 text-red-500" />
                    <span className="text-sm font-medium">Email</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-purple-500"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-6 w-6 text-green-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Share2 className="h-6 w-6 text-purple-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="text-sm font-medium">
                      {copied ? "Koobiyey" : "Koobi Link"}
                    </span>
                  </motion.button>
                </div> */}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 bg-gray-50 flex items-center border-t border-gray-200">
            <Button
              onClick={onContinue}
              className="w-full py-5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              Arag shaxda tartanka
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShareLesson;
