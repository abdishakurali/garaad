import { Metadata } from "next";

// Preferred URL is /community-preview — canonical so this duplicate URL is not indexed as separate content
export const metadata: Metadata = {
  alternates: { canonical: "https://garaad.org/community-preview" },
  robots: { index: false, follow: true },
};

export default function CommunityPreviewAltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
