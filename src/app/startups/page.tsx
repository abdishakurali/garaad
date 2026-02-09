import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Startups | Sida loo dhiso MVP iyo Tech Stack | Garaad",
    description: "Baro sida loo dhiso Startup heer caalami ah. Sida loo dhiso MVP, Tech Stack-ga ugu fiican, iyo Deployment-ka Vercel oo Af-Soomaali ah.",
    keywords: ["Startup Soomaali", "MVP Soomaali", "Vercel Soomaali", "Mobile App Development", "Founder Somali"],
};

export default function StartupsPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                        Dhis <span className="text-primary">Startup-kaaga</span> Maanta
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Garaad wuxuu kugu taageerayaa inaad ka guurto fikrad una guurto wax soo saar dhab ah 5 toddobaad gudahood.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4 text-primary">Sida loo dhiso MVP</h3>
                        <p className="text-slate-400">Baro sida loo soo saaro Minimum Viable Product adiga oo isticmaalaya qalabka ugu casrisan.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4 text-primary">Tech Stack-ga Startups</h3>
                        <p className="text-slate-400">React, Next.js, Node.js iyo database-yada ugu haboon ganacsiyada cusub.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4 text-primary">Deployment-ka Vercel</h3>
                        <p className="text-slate-400">U daabac software-kaaga aduunka oo dhan hal click adiga oo isticmaalaya Vercel.</p>
                    </div>
                </div>

                <div className="mt-20 p-12 rounded-[3rem] bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/20 text-center">
                    <h2 className="text-3xl font-black mb-4">Ma u diyaarsan tahay inaad noqoto Founder?</h2>
                    <p className="mb-8 text-lg opacity-80">Ku biir kumannaan arday ah oo dhisaya mustaqbalka.</p>
                    <a href="/welcome" className="inline-block px-12 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-transform">
                        BILOW HADDA
                    </a>
                </div>
            </main>

            <FooterSection />
        </div>
    );
}
