import { Syne, DM_Sans } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${syne.variable} ${dmSans.variable} font-dmsans`}>
      {children}
    </div>
  );
}
