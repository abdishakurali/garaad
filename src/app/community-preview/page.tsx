"use client";

import { Header } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { Reveal } from "@/components/landing/Reveal";
import Image from "next/image";
import { Users, MessageSquare, Flame, Trophy, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CommunityPreview() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleJoin = () => {
        if (isAuthenticated) {
            router.push("/community");
        } else {
            router.push("/welcome");
        }
    };

    const features = [
        {
            icon: MessageSquare,
            title: "Wada-hadal Joogto ah",
            desc: "Kula sheekayso ardayda kale iyo khubarada tignoolajiyada meel walba ay joogaan."
        },
        {
            icon: Flame,
            title: "Loolan iyo Tartan",
            desc: "Ku biir tartamada toddobadlaha ah ee lagu dhisayo mashaariicda SaaS iyo STEM."
        },
        {
            icon: Trophy,
            title: "Aqoonsi iyo Abaalmarino",
            desc: "Hel darajooyin sare iyo aqoonsi marka aad caawiso dadka kale ama aad guul gaarto."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-10 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                    {/* Main Image Showcase */}
                    <Reveal>
                        <div className="relative max-w-5xl mx-auto mb-24 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-card rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
                                <Image
                                    src="/images/community.jpeg"
                                    alt="Garaad Community Preview"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-cover"
                                    priority
                                />

                                {/* Overlay Label */}
                                <div className="absolute bottom-6 right-6 glassmorphism px-6 py-3 rounded-2xl border border-white/20 hidden md:flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-bold text-foreground">Community-ga waa Live!</span>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-float" />
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float delay-1000" />
                        </div>
                    </Reveal>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {features.map((f, i) => (
                            <Reveal key={i}>
                                <div className="bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all group h-full">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <f.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <Reveal>
                        <div className="bg-primary rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:32px_32px]" />

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-black mb-6">
                                    Ma Diyaar baad u tahay inaad Bilowdo?
                                </h2>
                                <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                                    Ku biir boqolaal arday iyo aqoonyahano Soomaaliyeed ah oo maalin walba wadaaga aqoon iyo waayo-aragnimo dhab ah.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button
                                        onClick={handleJoin}
                                        className="w-full sm:w-auto px-10 py-5 bg-white text-primary font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Hadda Ku Biir
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <Link
                                        href="/challenge"
                                        className="w-full sm:w-auto px-10 py-5 bg-primary-foreground/10 text-white font-black rounded-2xl hover:bg-primary-foreground/20 transition-all border border-white/20"
                                    >
                                        Baro Challenge-ka
                                    </Link>
                                </div>

                                <div className="mt-12 flex items-center justify-center gap-8 opacity-70 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span className="text-sm font-bold">Amaan & Hufnaan</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        <span className="text-sm font-bold">Garaad Hub</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </main>

            <FooterSection />
            <WhatsAppFloat />
        </div>
    );
}
