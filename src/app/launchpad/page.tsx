import { Metadata } from "next";
import { LaunchpadListClient } from "./LaunchpadListClient";

export const metadata: Metadata = {
    title: "Garaad Launchpad | Soo Bandhig Startup-kaaga",
    description: "Xarunta startup-yada Soomaaliyeed. Hel mashruucyo cusub, codee kuwa aad jeceshahay, ama soo bandhig mashruucaaga tech-ka ah.",
    openGraph: {
        title: "Garaad Launchpad - Builders to Founders",
        description: "Hel mashaariicda ugu xiisaha badan ee ay dhisayaan dhalinyarada Soomaaliyeed. Launch, Vote & Grow.",
        url: "https://garaad.so/launchpad",
        images: [{ url: "/images/og-launchpad.jpg" }],
    },
};

export default function LaunchpadPage() {
    return <LaunchpadListClient />;
}
