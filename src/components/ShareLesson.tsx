"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Share,
  Copy,
  Check,
  Twitter,
  Facebook,
  PhoneIcon as WhatsApp,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface ShareLessonProps {
  lessonTitle: string;
  courseName: string;
  points: number;
  onContinue: () => void;
  lessonId: string;
  courseId: string;
}

const ShareLesson: React.FC<ShareLessonProps> = ({
  lessonTitle,
  courseName,
  points,
  onContinue,
  lessonId,
  courseId,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/courses/${courseId}/lessons/${lessonId}`
      : "";

  const shareText = `Waxaan dhamaystiray casharkan "${lessonTitle}" ee kooraska "${courseName}" oo aan ku helay ${points} dhibcood! 🎉`;

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
    setIsSharing(true);
    try {
      let shareUrl = "";

      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}&quote=${encodeURIComponent(shareText)}`;
          break;
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(
            `${shareText} ${shareUrl}`
          )}`;
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: `${courseName} - ${lessonTitle}`,
              text: shareText,
              url: shareUrl,
            });
            toast.success("Waad la wadaagtay!");
            setIsSharing(false);
            return;
          } else {
            await handleCopyLink();
            setIsSharing(false);
            return;
          }
      }

      window.open(shareUrl, "_blank");
      toast.success("Waad la wadaagtay!");
    } catch (err) {
      toast.error("Ma awoodin in la wadaago");
      console.error("Failed to share:", err);
    }
    setIsSharing(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 text-center">
            <div className="mx-auto mb-2">
              <div className="bg-primary/10 p-3 rounded-full inline-block">
                <Share className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">La wadaag guushaada!</CardTitle>
            <CardDescription>
              Waxaad dhamaysatay casharkan "{lessonTitle}" oo aad ku heshay{" "}
              {points} dhibcood
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-4 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm">
                  <h3 className="font-bold text-primary">{courseName}</h3>
                  <p className="text-sm text-gray-600">{lessonTitle}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                    <Check className="h-3 w-3" /> Dhamaystiray
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                U sheeg saaxiibadaa guushaada!
              </p>

              <div className="flex justify-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.button
                    key="twitter"
                    onClick={() => handleShare("twitter")}
                    className="flex flex-col items-center gap-1"
                    whileTap={{ scale: 0.95 }}
                    disabled={isSharing}
                  >
                    <div className="bg-[#1DA1F2]/10 p-3 rounded-full">
                      <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    </div>
                    <span className="text-xs text-gray-600">Twitter</span>
                  </motion.button>

                  <motion.button
                    key="facebook"
                    onClick={() => handleShare("facebook")}
                    className="flex flex-col items-center gap-1"
                    whileTap={{ scale: 0.95 }}
                    disabled={isSharing}
                  >
                    <div className="bg-[#1877F2]/10 p-3 rounded-full">
                      <Facebook className="h-5 w-5 text-[#1877F2]" />
                    </div>
                    <span className="text-xs text-gray-600">Facebook</span>
                  </motion.button>

                  <motion.button
                    key="whatsapp"
                    onClick={() => handleShare("whatsapp")}
                    className="flex flex-col items-center gap-1"
                    whileTap={{ scale: 0.95 }}
                    disabled={isSharing}
                  >
                    <div className="bg-[#25D366]/10 p-3 rounded-full">
                      <WhatsApp className="h-5 w-5 text-[#25D366]" />
                    </div>
                    <span className="text-xs text-gray-600">WhatsApp</span>
                  </motion.button>
                </AnimatePresence>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-dashed"
                  disabled={copied || isSharing}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Waa la koobiyeeyay</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Koobi linkiga</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-gray-50 flex justify-between">
            <Button
              onClick={onContinue}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSharing}
            >
              Arag leaderboard-ka
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShareLesson;
