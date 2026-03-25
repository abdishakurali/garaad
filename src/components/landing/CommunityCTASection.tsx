"use client";

import Link from "next/link";
import useSWR from "swr";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";
import { Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function CommunityCTASection() {
    const { data: stats } = useSWR<{ students_count: number }>(
        `${API_BASE_URL}/api/public/landing-stats/`,
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
    );
    const n = stats?.students_count && stats.students_count > 0 ? stats.students_count : 88;

    return (
        <section className="relative py-14 md:py-20 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 dark:from-primary/10 dark:via-blue-500/10 dark:to-purple-500/10 overflow-hidden">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                Join the Movement
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                            Diyaar ma u tahay inaad bilowdo{" "}
                            <span className="text-primary">safarkaaga Tech-ka?</span>
                        </h2>

                        <p className="text-muted-foreground mb-4 max-w-lg">
                            Ku biir {n}+ arday oo maanta dhisaya mustaqbalkooda. Ma jirto halis (Risk) — ku bilow
                            bilaash.
                        </p>

                        <p className="text-sm text-muted-foreground mb-6 max-w-lg">
                            {EXPLORER_IS_FREE
                                ? "Bulshada waxaa loo furay dhammaan isticmaalayaasha diiwaangashan — Challenge waa qorshaha casriga ah."
                                : "Bulshada waxaa laga helaa heerka Bilaash iyo Challenge."}
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                            <Link
                                href={EXPLORER_IS_FREE ? "/signup" : "/subscribe?plan=explorer"}
                                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all"
                            >
                                <span>
                                    {EXPLORER_IS_FREE ? "Ku bilow Bilaash — weligeed" : "Bilow Bilaash — weligeed"}
                                </span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/communitypreview"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-border bg-background/80 font-bold text-foreground hover:bg-muted/60 transition-all"
                            >
                                <Users className="w-5 h-5 text-primary" />
                                Arag waxa ardaydu ka hadlayaan →
                            </Link>
                            <Link
                                href="/community"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 font-bold text-primary hover:bg-primary/10 transition-all"
                            >
                                <Users className="w-5 h-5 shrink-0" />
                                <span>Arag Bulshada</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
