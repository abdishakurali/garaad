import { Header } from "@/components/Header";
import Footer from "@/components/sections/FooterSection";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
