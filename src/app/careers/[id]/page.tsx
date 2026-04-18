import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const role = roles.find((r) => r.id === id);
  if (!role) return { title: 'Careers - Garaad' };
  return { title: `${role.title} - Garaad Careers` };
}

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/careers"
          className="inline-block text-purple-400 hover:text-purple-300 mb-8 font-medium"
        >
          ← Careers
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {role.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              {role.department}
            </span>
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
              {role.type}
            </span>
            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
              {role.location}
            </span>
          </div>
        </div>

        <div className="prose prose-invert prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Akri Tan Marka Hore</h2>
            <p className="text-slate-300 whitespace-pre-line">{role.fullDescription}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Waxa Aad Sameyn Doonto</h2>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              {role.responsibilities?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Shuruudaha (Lama Dhaafi Karo)</h2>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              {role.requirements?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Dadka Aan Dooneyn</h2>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              {role.dontWant?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Waxa Aad Heli Doonto</h2>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              {role.perks?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Filter (Si Fiican U Akhri)</h2>
            <p className="text-slate-300">
              Haddii aadan muujin karin:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2 mt-2">
              <li>Videos leh engagement sare</li>
              <li>Awood aad ku keento shaqo si degdeg ah</li>
              <li>Horumar muuqda (improvement over time)</li>
            </ul>
            <p className="text-slate-300 mt-4">Ha codsan.</p>
          </section>

          <section className="mb-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Sida Loo Codsado</h2>
            <p className="text-slate-300 whitespace-pre-line">{role.howToApply}</p>
          </section>
        </div>
      </div>
    </div>
  );
}