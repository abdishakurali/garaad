import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Us | Garaad',
  description: 'Learn about Garaad\'s mission to systemize STEM education for the Somali generation through radical truth and merit-based learning.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            About Garaad
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building the mental "machine" needed to navigate a complex world
          </p>
        </div>

        {/* Mission Statement */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-foreground/90 leading-relaxed mb-6">
            At <span className="font-bold text-primary">Garaad.org</span>, we believe that education is not just about memorizing facts;
            it is about building the mental "machine" needed to navigate a complex world. Our name, <em>Garaad</em>, reflects the Somali
            value of "wisdom" and "intellect"—a quality that, like the best systems, is earned through merit and constant evolution.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Radical Truth in Learning</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We don't shield learners from the "hard" parts of STEM. We embrace the reality that progress requires struggle.
              By making logic and problem-solving transparent, we empower students to see the world as it truly is.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Pain + Reflection = Progress</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We treat every wrong answer as a data point for growth. Our platform is designed to help students identify their own
              "blind spots," diagnose the root causes of their mistakes, and iterate until they reach mastery.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">The Idea Meritocracy of Knowledge</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We believe the best solutions should rise to the top. Garaad.org provides a platform where Somali students,
              regardless of background, can compete and collaborate based on the quality of their thinking and their dedication to the truth.
            </p>
          </div>
        </div>

        {/* Mission Box */}
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">Our Mission</h2>
          <p className="text-foreground/80 text-lg leading-relaxed">
            To systemize the way the Somali generation learns, ensuring that every student has the tools to think for themselves
            and decide what is true and what they should do to achieve their goals.
          </p>
        </div>

        {/* Core Values Section */}
        <section className="py-32 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Qiimahayaga
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Qiimahayaga aasaasiga ah
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Cilmi-baaris",
                  icon: "🔍",
                  description: "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan.",
                },
                {
                  title: "Xawaare",
                  icon: "⚡",
                  description: "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna.",
                },
                {
                  title: "Mas'uuliyad",
                  icon: "🤝",
                  description: "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena.",
                },
                {
                  title: "Tayo",
                  icon: "✨",
                  description: "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno.",
                },
                {
                  title: "Isgaarsiin",
                  icon: "💬",
                  description: "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena.",
                },
                {
                  title: "Hal-abuur",
                  icon: "💡",
                  description: "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah.",
                },
              ].map((value, index) => (
                <Card key={index} className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-white/5 backdrop-blur-sm rounded-[32px]">
                  <CardHeader>
                    <div className="text-3xl mb-2">{value.icon}</div>
                    <CardTitle className="text-xl text-primary font-bold">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Special Section */}
        <section className="py-32 bg-[#F8FAFC] dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Sifooyinkayaga
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Maxaa Garaad ka dhigaya mid gaar ah?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Si gaar ah loogu talagalay ardayda Soomaaliyeed",
                  description: "Waxaan fahamsanahay xaaladda dhaqanka iyo kala duwanaanta luqadda ee dadka aan beegsaneyno.",
                  color: "bg-emerald-500/5",
                  borderColor: "border-l-emerald-500",
                },
                {
                  title: "Diiradda saaraya xallinta dhibaatooyinka",
                  description: "Koorsooyinkayagu waxay xoogga saaraan waxbarashada ku saleysan ficilka iyo fikirka qoto dheer.",
                  color: "bg-sky-500/5",
                  borderColor: "border-l-sky-500",
                },
                {
                  title: "Isticmaal xog yar",
                  description: "Waxaan jebineynaa caqabadaha helitaanka anagoo naqshadeynayna barxad isticmaalka xogta yaraysa.",
                  color: "bg-amber-500/5",
                  borderColor: "border-l-amber-500",
                },
                {
                  title: "Dhismaha bulsho",
                  description: "Waxaan dhiseynaa nidaam taageero oo ardayda Soomaaliyeed ay ku xiriiri karaan.",
                  color: "bg-rose-500/5",
                  borderColor: "border-l-rose-500",
                },
              ].map((feature, index) => (
                <div key={index} className={cn("rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border-l-4 bg-white dark:bg-white/5", feature.borderColor)}>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision and Mission */}
        <section className="py-32 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Yoolkayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Himilada & Aragtida
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-6">
            <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">Himilada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Awoodsiinta ardayda Soomaaliyeed waxbarasho la heli karo oo isdhexgal ah oo dhista fikirka qoto dheer iyo xirfadaha STEM si ay ugu guuleystaan adduun tignoolajiyaddu hoggaamiso.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">Aragtida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Kacdoonka nidaamka dhijitaalka ah iyadoo la bixinayo waxbarasho tayo leh oo awood u siinaysa ardayda Soomaaliyeed inay ku kobcaan caalamka.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Founder CTA */}
        <div className="text-center">
          <Link
            href="/about/abdishakuur-ali"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Meet the Founder
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
