"use client";

import Link from 'next/link';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';

const coreValues = [
  { title: "Cilmi-baaris", icon: "🔍", description: "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan." },
  { title: "Xawaare", icon: "⚡", description: "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna." },
  { title: "Mas'uuliyad", icon: "🤝", description: "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena." },
  { title: "Tayo", icon: "✨", description: "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno." },
  { title: "Isgaarsiin", icon: "💬", description: "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena." },
  { title: "Hal-abuur", icon: "💡", description: "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah." },
];

export function RoleContent({ role }: { role: any }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link
            href="/careers"
            className="inline-block text-primary hover:text-primary/80 mb-8 font-medium"
          >
            ← Careers
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {role.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full font-medium">
                {role.department}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
                {role.type}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
                {role.location}
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Akri Tan Marka Hore</h2>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{role.fullDescription}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Waxa Aad Sameyn Doonto</h2>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-3">
                {role.responsibilities?.map((item: string, i: number) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Shuruudaha (Lama Dhaafi Karo)</h2>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-3">
                {role.requirements?.map((item: string, i: number) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Dadka Aan Dooneyn</h2>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-3">
                {role.dontWant?.map((item: string, i: number) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Waxa Aad Heli Doonto</h2>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-3">
                {role.perks?.map((item: string, i: number) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8 p-6 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Sida Loo Codsado</h2>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{role.howToApply}</p>
            </section>
          </div>
        </div>

        {/* Qiimahayaga Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                Qiimahayaga
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Qiimahayaga aasaasiga ah
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all">
                  <div className="text-2xl mb-2">{value.icon}</div>
                  <h3 className="text-base font-bold text-violet-700 dark:text-violet-300 mb-1">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{value.description}</p>
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