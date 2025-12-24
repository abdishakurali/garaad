"use client";

import { useParams } from "next/navigation";
import AuthService from "@/services/auth";
import { useRef } from "react";
import html2canvas from "html2canvas-pro"; // Updated to support oklch
import { Share2, X } from "lucide-react";
import Image from "next/image";

const CERTIFICATE_FONT = "font-serif";

const Watermark = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0"
    viewBox="0 0 460 396"
    xmlns="http://www.w3.org/2000/svg"
    style={{ objectFit: "contain" }}
  >
    <g>
      <path
        d="M106.883 387.394V395.569H162.201V387.394L138.493 368.318H122.272L106.883 387.394Z"
        fill="black"
      />
      <path
        d="M90.5195 387.394V395.569H145.838V387.394L122.13 368.318H105.909L90.5195 387.394Z"
        fill="black"
      />
      <path
        d="M98.3086 386.987V391.529H134.928V386.987L119.234 374.371H108.496L98.3086 386.987Z"
        fill="black"
      />
    </g>
  </svg>
);

const formatDate = (date: Date) =>
  date.toLocaleDateString("so-SO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Certificate: React.FC<{
  lessonTitle: string;
  onContinue: () => void;
}> = ({ lessonTitle, onContinue }) => {
  const params = useParams<{
    category: string;
    courseSlug: string;
    lessonId: string;
  }>();
  const { courseSlug } = params;
  const storedUser = AuthService.getInstance().getCurrentUser();
  const courseName = courseSlug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const today = new Date();
  const certRef = useRef<HTMLDivElement>(null);

  const garaadName = storedUser ? `Garaad ${storedUser.username} ${storedUser.last_name}` : 'Garaad User';

  const handleShare = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    const dataUrl = canvas.toDataURL("image/png");
    let shared = false;
    if (navigator.canShare && navigator.canShare({ files: [] })) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "garaad-certificate.png", {
        type: "image/png",
      });
      try {
        await navigator.share({
          files: [file],
          title: "Shahaadada Garaad",
          text: "Eeg shahaadada aan helay Garaad!",
        });
        shared = true;
        window.alert(
          "Waa lagu guuleystay! La wadaagista si toos ah waa shaqeysay."
        );
      } catch { }
    }
    if (!shared) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "garaad-certificate.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.alert(
        "La wadaagista tooska ah ma shaqayn. Sawirka waa la soo dejiyey. Fadlan la wadaag asxaabtaada adigoo sawirka isticmaalaya!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-white print:bg-white relative">
      <button
        onClick={() => onContinue()}
        className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white text-gray-600 hover:text-primary p-2 rounded-full shadow-lg transition-all duration-200 print:hidden"
        aria-label="Si wad"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        ref={certRef}
        className="w-full max-w-3xl mx-auto p-8 md:p-16 border-4 border-primary rounded-3xl shadow-2xl print:shadow-none print:border-black print:rounded-none print:p-0 relative bg-white/90"
        style={{
          background:
            "repeating-linear-gradient(135deg, #f3e8ff 0px, #fff 40px, #f3e8ff 80px)",
          boxShadow: "0 8px 32px 0 rgba(168,85,247,0.15)",
        }}
      >
        <Watermark />
        <div className="absolute top-2 left-2 z-20">
          <Image
            src="/favicon.ico"
            alt="Garaad Logo"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary bg-white shadow object-contain"
            priority={true}
            loading="eager"
          />
        </div>
        <div className="flex flex-col items-center gap-2 relative z-10">
          <h2
            className={`text-xl md:text-2xl tracking-widest text-primary font-extrabold uppercase mb-2 ${CERTIFICATE_FONT}`}
          >
            Shahaadada Dhamaystirka
          </h2>
          <span className="block text-sm text-gray-500 mb-4">
            Waxaa la guddoonsiiyay
          </span>
          <span
            className="block text-3xl md:text-4xl font-extrabold text-primary mb-4 underline decoration-primary/30 decoration-2 underline-offset-4 font-sans tracking-tight"
            style={{ letterSpacing: "-1px" }}
          >
            {garaadName}
          </span>
          <span className="block text-base text-gray-700 mb-2">
            dhamaystirka koorsada
          </span>
          <span className="block text-xl md:text-2xl font-semibold text-primary mb-2">
            {courseName}
          </span>
          <span className="block text-base text-gray-700 mb-2">
            Casharka: <span className="font-semibold">{lessonTitle}</span>
          </span>
          <span className="block text-base text-gray-700 mb-6 text-center max-w-xl">
            Waad ku mahadsantahay muujinta dabeecad iyo daacadnimo sare.
            Hambalyo guushaada!
          </span>
          <div className="flex w-full justify-between items-center mt-6 gap-4">
            <div className="flex flex-col items-center z-10 min-w-[110px]">
              <span className="text-xs text-gray-500">La bixiyay:</span>
              <span className="text-sm font-semibold text-primary">
                {formatDate(today)}
              </span>
            </div>
            <div className="flex justify-center print:hidden z-20">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-primary/90 text-lg"
              >
                <Share2 className="w-6 h-6" />
                La wadaag
              </button>
            </div>
            <div className="flex flex-col items-center z-10 min-w-[130px]">
              <svg
                width="100"
                height="32"
                viewBox="0 0 120 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 30 Q 40 10, 60 30 Q 80 50, 110 10"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M20 35 Q 30 25, 50 35 Q 70 45, 100 15"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <div className="w-20 border-t border-primary my-1" />
              <span className="block text-xs text-primary font-semibold mt-1">
                garaad.org
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 w-full text-center text-primary font-semibold text-lg tracking-wide z-20">
          Aqoon la&apos;aan, waa iftiin la&apos;aan.
        </div>
      </div>
    </div>
  );
};

export default Certificate;
