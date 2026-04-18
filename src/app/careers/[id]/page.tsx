import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Providers } from '../../providers';
import { RoleContent } from './RoleContent';

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
    <Providers>
      <RoleContent role={role} />
    </Providers>
  );
}