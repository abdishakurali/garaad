"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Users, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

export function CommunityCTASection() {
    const router = useRouter();
    const { user } = useAuthStore();
    const isAuthenticated = !!user;

    const handleJoin = () => {
        if (isAuthenticated) {
            router.push("/community");
        } else {
            router.push("/welcome");
        }
    };

    return (
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 dark:from-primary/10 dark:via-blue-500/10 dark:to-purple-500/10 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Image */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
                            <Image
                                src="/images/community.jpeg"
                                alt="Garaad Community"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                unoptimized={true}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">500+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active Members</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                Join the Movement
                            </span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                            Ka Mid Noqo{" "}
                            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                Bulshada Garaad
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Ku biir boqolaal arday iyo aqoonyahano Soomaaliyeed ah oo maalin walba wadaaga aqoon,
                            waayo-aragnimo, iyo taageero. Waxaan wada dhisaynaa mustaqbalka tignoolajiyada Soomaaliya.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Wada-hadal Joogto ah</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Kula sheekayso ardayda kale iyo khubarada tignoolajiyada meel walba ay joogaan.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Loolan iyo Tartan</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Ku biir tartamada toddobadlaha ah ee lagu dhisayo mashaariicda SaaS iyo STEM.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">Taageero iyo Aqoonsi</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Hel taageero shaqsiyan ah iyo aqoonsi marka aad caawiso dadka kale ama aad guul gaarto.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleJoin}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
                        >
                            <Users className="w-6 h-6" />
                            <span>Hadda Ku Biir Bulshada</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
                            Bilaash ah • Bilow isla markiiba • Taageero 24/7
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
