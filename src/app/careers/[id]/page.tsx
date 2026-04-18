import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const role = roles.find((r) => r.id === id);
  if (!role) return { title: 'Careers - Garaad' };
  return { title: `${role.title} - Garaad Careers` };
}

const coreValues = [
  { title: "Cilmi-baaris", icon: "🔍", description: "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan." },
  { title: "Xawaare", icon: "⚡", description: "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna." },
  { title: "Mas'uuliyad", icon: "🤝", description: "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena." },
  { title: "Tayo", icon: "✨", description: "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno." },
  { title: "Isgaarsiin", icon: "💬", description: "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena." },
  { title: "Hal-abuur", icon: "💡", description: "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah." },
];

const roles = [
  {
    id: 'video-editor',
    title: 'Video Editor (AI-First, Wax Soo Saar Sare)',
    department: 'Content',
    type: 'Full-time',
    location: 'Remote',
    summary: 'Soo saar videos leh retention sare (short + long form) si joogto ah. Isticmaal AI tools si aad u dedejiso shaqada una kordhiso output-ka.',
    fullDescription: `Kani waa role wax-qabad (performance), ma aha meel wax lagu barto.
Haddii aad gaabis tahay, shaqadaadu tahay mid caadi ah, ama aad u baahan tahay in lagu haga mar walba — ha codsan.`,
    responsibilities: [
      'Soo saar videos leh retention sare (short + long form) si joogto ah',
      'Isticmaal AI tools si aad u dedejiso shaqada una kordhiso output-ka',
      'Ka fikir sida viewer-ka: hook → hold → payoff',
      'Maamul oo daabac content-ka: TikTok, X (Twitter), YouTube',
      'Si degdeg ah u shaqee, si degdeg ahna u hagaaji (iterate)',
    ],
    requirements: [
      'Xirfad editing dhab ah (soo dir shaqooyin run ah, ma aaha practice)',
      'Faham cad oo ku saabsan attention + retention',
      'Hore u isticmaalay AI tools',
      'Awood aad ku shaqeyso adigoon la maamulin mar walba',
      'Feejignaan sare — khaladaad yar ayaad aragtaa oo saxdaa',
    ],
    dontWant: [
      'Editors gaabis ah',
      'Kuwa sugaya amar kasta',
      'Kuwa over-edit sameeya iyagoon ujeedo lahayn',
      'Content caajis ah oo aan lahayn energy',
    ],
    perks: [
      'Helitaan buuxa oo AI tools lacag leh',
      'Mushahar tartan leh',
      'Fasax la bixiyo',
      'Bonus ku saleysan performance',
      'Fursad koritaan — output-kaaga ayaa goaamiya heerkaaga',
    ],
    howToApply: `Soo dir:
• 3–5 videos-kaaga ugu fiican (ha keenin filler)
• Links accounts aad ka shaqeysay
• Qoraal gaaban: sidee AI kuu kordhisaa speed-kaaga iyo output-kaaga

Subject: "I ship fast"

Email: info@garaad.org`,
  },
];

export default async function RolePage({ params }: Props) {
  const { id } = await params;
  const role = roles.find((r) => r.id === id);
  if (!role) notFound();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link
            href="/careers"
            className="inline-block text-primary hover:text-primary/80 mb-8 font-medium"
          >
            ← Careers
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {role.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {role.department}
              </span>
              <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full">
                {role.type}
              </span>
              <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full">
                {role.location}
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Akri Tan Marka Hore</h2>
              <p className="text-muted-foreground whitespace-pre-line">{role.fullDescription}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Waxa Aad Sameyn Doonto</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                {role.responsibilities?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Shuruudaha (Lama Dhaafi Karo)</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                {role.requirements?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Dadka Aan Dooneyn</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                {role.dontWant?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Waxa Aad Heli Doonto</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                {role.perks?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">Sida Loo Codsado</h2>
              <p className="text-muted-foreground whitespace-pre-line">{role.howToApply}</p>
            </section>
          </div>
        </div>

        {/* Qiimahayaga Section */}
        <section className="py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Qiimahayaga
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Qiimahayaga aasaasiga ah
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all">
                  <div className="text-xl mb-2">{value.icon}</div>
                  <h3 className="text-base font-bold text-primary mb-1">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}