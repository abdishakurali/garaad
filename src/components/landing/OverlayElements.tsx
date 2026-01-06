"use client";

import dynamic from "next/dynamic";
import { WhatsAppFloat } from "./WhatsAppFloat";

const SocialProof = dynamic(() => import("./SocialProof").then(mod => mod.SocialProof), {
    ssr: false,
});

export function OverlayElements() {
    return (
        <>
            <WhatsAppFloat />
            <SocialProof />
        </>
    );
}
