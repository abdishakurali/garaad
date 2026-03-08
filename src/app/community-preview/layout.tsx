import { Metadata } from "next";

const COMMUNITY_URL = "https://garaad.org/community-preview";

export const metadata: Metadata = {
  title: "Bulshada Garaad | Somali Developers",
  description:
    "Ku biir bulshada developers Soomaalida ah. Share garee aqoontaada, weydii su'aalo, kula shaqee.",
  keywords: [
    "Garaad community",
    "Somali developers",
    "tech community Soomaali",
    "Garaad bulshada",
  ],
  alternates: { canonical: COMMUNITY_URL },
  openGraph: {
    type: "website",
    url: COMMUNITY_URL,
    title: "Bulshada Garaad | Somali Developers",
    description:
      "Ku biir bulshada developers Soomaalida ah. Share garee aqoontaada, weydii su'aalo, kula shaqee.",
    images: [
      {
        url: "https://garaad.org/images/og-main.jpg",
        width: 1200,
        height: 630,
        alt: "Bulshada Garaad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Bulshada Garaad | Somali Developers",
    description:
      "Ku biir bulshada developers Soomaalida ah. Share garee aqoontaada, weydii su'aalo, kula shaqee.",
    images: ["https://garaad.org/images/og-main.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function CommunityPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
