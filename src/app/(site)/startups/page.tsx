import { Metadata } from "next";
import Link from "next/link";

const STARTUPS_URL = "https://garaad.org/startups";

export const metadata: Metadata = {
  title: "Startups — Sida Loo Dhiso MVP iyo Tech Stack | Garaad",
  description:
    "Baro sida loo dhiso startup heer caalami ah — MVP, Tech Stack (React, Node, MongoDB), iyo deployment Vercel. Af-Soomaali. How to build your startup in Somali.",
  keywords: ["Startup Soomaali", "MVP Soomaali", "Vercel Soomaali", "Mobile App Development", "Founder Somali"],
  alternates: { canonical: STARTUPS_URL },
  openGraph: {
    type: "website",
    url: STARTUPS_URL,
    title: "Startups — Sida Loo Dhiso MVP iyo Tech Stack | Garaad",
    description:
      "Baro sida loo dhiso startup heer caalami ah — MVP, Tech Stack, deployment Vercel. Af-Soomaali. How to build your startup.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Startups — Sida Loo Dhiso MVP iyo Tech Stack | Garaad",
    description: "Baro sida loo dhiso startup Af-Soomaali — MVP, React, Node, Vercel.",
  },
  robots: { index: true, follow: true },
};

export default function StartupsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Startups — Garaad",
    url: STARTUPS_URL,
    description:
      "Hagaha dhisidda startup: MVP, tech stack, iyo deployment oo Af-Soomaali ah.",
    about: [
      "Startup MVP",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Vercel Deployment",
    ],
    inLanguage: "so",
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            Dhis <span className="text-primary">Startup-kaaga</span> Maanta
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Garaad wuxuu kugu taageerayaa inaad ka guurto fikrad una guurto wax soo saar dhab ah 5 toddobaad gudahood.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-muted-foreground mb-16">
          <p className="text-foreground/90 leading-relaxed max-w-3xl mx-auto text-center">
            Garaad waa halka aad ka baran kartid sida loo dhiso mashruuc ganacsi oo casri ah oo adduunka oo dhan laga heli karo.
            Koorsooyinkeena waxaa ka mid ah sida loo abuuro Minimum Viable Product (MVP), sida loo dooro tech stack (React, Next.js, Node.js, MongoDB),
            iyo sida loo soo saaro barnaamijkaaga internetka (deployment) adoo isticmaalaya Vercel iyo alaab kale. Waxaan kuu diyaarinaynaa
            xirfadaha loobaahan yahay inaad noqoto founder Soomaali ah oo dhisaya wax soo saar dhab ah — bilaash bilow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-primary">Sida loo dhiso MVP</h3>
            <p className="text-slate-400">
              Baro sida loo soo saaro Minimum Viable Product adiga oo isticmaalaya qalabka ugu casrisan. MVP waa nooca ugu horreeya ee
              barnaamijkaaga ganacsiga si loo tijaabiyo fikradda suuqa. Garaad waxaa kuu sheegaya tallaabooyinka: design, build, deploy, measure.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-primary">Tech Stack-ga Startups</h3>
            <p className="text-slate-400">
              React, Next.js, Node.js iyo database-yada ugu haboon ganacsiyada cusub. Waxaan kuu baranaynaa full-stack development —
              frontend (waayo-aragnimada isticmaalaya), backend (server iyo API), iyo database (MongoDB) — oo dhammaan Af-Soomaali.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-primary">Deployment-ka Vercel</h3>
            <p className="text-slate-400">
              U daabac software-kaaga aduunka oo dhan hal click adiga oo isticmaalaya Vercel. Deployment waa sida barnaamijkaaga ugu
              baxo server-kaaga si internetka oo dhan ugu heli karo. Waxaan kuu tusaynaa CI/CD, environment variables, iyo custom domains.
            </p>
          </div>
        </div>

        <div className="mt-20 p-12 rounded-[3rem] bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/20 text-center">
          <h2 className="text-3xl font-black mb-4">Ma u diyaarsan tahay inaad noqoto Founder?</h2>
          <p className="mb-8 text-lg opacity-80">Ku biir kumannaan arday ah oo dhisaya mustaqbalka.</p>
          <Link href="/welcome" className="inline-block px-12 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-transform">
            Hadda bilow
          </Link>
        </div>
      </main>
    </div>
  );
}
