import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Providers } from '../providers';

export const metadata: Metadata = {
  title: 'Careers - Garaad',
  description: 'Join team Garaad - Waxbarasho Tayo Leh',
};

const roles = [
  {
    id: 'video-editor',
    title: 'Video Editor (AI-First)',
    department: 'Content',
    type: 'Full-time',
    location: 'Remote',
    summary: 'Soo saar videos leh retention sare (short + long form) si joogto ah. Isticmaal AI tools.',
  },
];

const coreValues = [
  { title: "Cilmi-baaris", icon: "🔍", description: "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan." },
  { title: "Xawaare", icon: "⚡", description: "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna." },
  { title: "Mas'uuliyad", icon: "🤝", description: "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena." },
  { title: "Tayo", icon: "✨", description: "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno." },
  { title: "Isgaarsiin", icon: "💬", description: "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena." },
  { title: "Hal-abuur", icon: "💡", description: "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah." },
];

export default function CareersPage() {
  return (
    <Providers>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link
            href="/"
            className="inline-block text-primary hover:text-primary/80 mb-8 font-medium"
          >
            ← Ku soo dhawow Garaad
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Careers
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Ku soo dhowow kooxda Garaad — Waxbarasho Tayo Leh 🦁
          </p>

          <div className="space-y-6">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={`/careers/${role.id}`}
                className="block bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {role.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {role.department}
                      </span>
                      <span>{role.type}</span>
                      <span>{role.location}</span>
                    </div>
                  </div>
                  <span className="text-primary group-hover:text-primary/80 transition-colors">
                    Akhri tan →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-muted-foreground">
              Have questions? {' '}
              <a href="mailto:info@garaad.org" className="text-primary hover:underline">
                info@garaad.org
              </a>
            </p>
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
                <Card key={index} className="h-full border-none shadow-md hover:shadow-lg transition-all bg-card">
                  <CardHeader>
                    <div className="text-2xl mb-2">{value.icon}</div>
                    <CardTitle className="text-lg text-primary font-bold">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </Providers>
  );
}