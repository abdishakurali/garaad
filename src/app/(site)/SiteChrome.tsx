"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Footer from "@/components/sections/FooterSection";

/** Hide main header and footer on lesson pages so they don't cover lesson content. */
function isLessonPage(pathname: string | null): boolean {
  return pathname != null && pathname.includes("/lessons/");
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onLesson = isLessonPage(pathname);

  if (onLesson) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
