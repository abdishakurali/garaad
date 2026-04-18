import { Noto_Sans_SC, Inter, Instrument_Serif, DM_Mono, DM_Serif_Display } from "next/font/google";

export const notoSansSC = Noto_Sans_SC({
    subsets: ["latin"],
    weight: ["400", "500", "700", "900"],
    display: "swap",
    variable: "--font-noto-sans-sc"
});

export const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-inter"
});

export const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-instrument-serif"
});

export const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
    variable: "--font-dm-mono"
});

export const dmSerifDisplay = DM_Serif_Display({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    display: "swap",
    variable: "--font-dm-serif-display"
});