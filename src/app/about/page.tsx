"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EarthAndSatellite = () => (
  <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="300" cy="300" r="150" fill="#4299E1" opacity="0.1" />
    <circle cx="300" cy="300" r="140" fill="#4299E1" opacity="0.2" />
    <circle cx="300" cy="300" r="130" fill="#4299E1" />
    <path d="M250 220 C270 210, 290 215, 310 225 C330 235, 350 230, 370 220 C390 210, 410 215, 430 230" stroke="#2B6CB0" fill="none" strokeWidth="8" />
    <path d="M240 280 C260 270, 280 275, 300 285 C320 295, 340 290, 360 280" stroke="#2B6CB0" fill="none" strokeWidth="8" />
    <path d="M260 340 C280 330, 300 335, 320 345 C340 355, 360 350, 380 340" stroke="#2B6CB0" fill="none" strokeWidth="8" />
    <g transform="translate(400,150) rotate(45)">
      <rect x="-20" y="-10" width="40" height="20" fill="#2D3748" />
      <rect x="-60" y="-5" width="35" height="10" fill="#4299E1" />
      <rect x="25" y="-5" width="35" height="10" fill="#4299E1" />
      <line x1="0" y1="-15" x2="0" y2="-25" stroke="#A0AEC0" strokeWidth="2" />
      <circle cx="0" cy="-25" r="3" fill="#A0AEC0" />
    </g>
    <circle cx="300" cy="300" r="200" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="10,10" fill="none" />
    <g fill="#CBD5E0">
      <circle cx="150" cy="150" r="2" />
      <circle cx="450" cy="150" r="2" />
      <circle cx="150" cy="450" r="2" />
      <circle cx="450" cy="450" r="2" />
      <circle cx="300" cy="100" r="2" />
      <circle cx="300" cy="500" r="2" />
      <circle cx="100" cy="300" r="2" />
      <circle cx="500" cy="300" r="2" />
    </g>
  </svg>
);

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div
          className="relative mb-24"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-12 md:mb-20">
            <div className="lg:w-1/2">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Waxbarashada Mustaqbalka
              </span>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-6 text-gray-900 leading-tight">
                Garaad: Iftiimin mustaqbalka ardayda Soomaaliyeed
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Hadafka Garaad waa in uu kor u qaado kartida xallinta dhibaatooyinka ee dadka Soomaaliyeed
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Ka fikir adduun uu arday kasta oo Soomaali ah, meel kasta oo uu
                joogo ama xaalad kasta uu ku jiro, uu heli karo waxbarasho tayo
                leh oo awood u siinaysa inu ku guuleyso qarnigan tignoolajiyada
                ku saleysan.
              </p>
              <Link href={"/welcome"}>
                <Button className="group" size="lg">
                  Baro wax badan{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div
              className="lg:w-1/2 flex items-center justify-center"
            >
              <div className="w-[400px] h-[400px]">
                <EarthAndSatellite />
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <section
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Qiimahayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Qiimahayaga aasaasiga ah
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cilmi-baaris",
                icon: "🔍",
                description:
                  "Waxaan si joogto ah u su&apos;aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan.",
              },
              {
                title: "Xawaare",
                icon: "⚡",
                description:
                  "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna.",
              },
              {
                title: "Mas&apos;uuliyad",
                icon: "🤝",
                description:
                  "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena.",
              },
              {
                title: "Tayo",
                icon: "✨",
                description:
                  "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno.",
              },
              {
                title: "Isgaarsiin",
                icon: "💬",
                description:
                  "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena.",
              },
              {
                title: "Hal-abuur",
                icon: "💡",
                description:
                  "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah.",
              },
            ].map((value, index) => (
              <div key={index} className="h-full">
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-3xl mb-2">{value.icon}</div>
                    <CardTitle className="text-xl text-primary">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* What Makes Us Special Section */}
        <section
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Sifooyinkayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Maxaa Garaad ka dhigaya mid gaar ah?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Si gaar ah loogu talagalay ardayda Soomaaliyeed",
                description:
                  "Waxaan fahamsanahay xaaladda dhaqanka iyo kala duwanaanta luqadda ee dadka aan beegsaneyno.",
                color: "bg-emerald-50",
                borderColor: "border-l-emerald-400",
              },
              {
                title: "Diiradda saaraya xallinta dhibaatooyinka",
                description:
                  "Koorsooyinkayagu waxay xoogga saaraan waxbarashada ku saleysan ficilka iyo fikirka qoto dheer.",
                color: "bg-sky-50",
                borderColor: "border-l-sky-400",
              },
              {
                title: "Isticmaal xog yar",
                description:
                  "Waxaan jebineynaa caqabadaha helitaanka anagoo naqshadeynayna barxad isticmaalka xogta yaraysa.",
                color: "bg-amber-50",
                borderColor: "border-l-amber-400",
              },
              {
                title: "Dhismaha bulsho",
                description:
                  "Waxaan dhiseynaa nidaam taageero oo ardayda Soomaaliyeed ay ku xiriiri karaan.",
                color: "bg-rose-50",
                borderColor: "border-l-rose-400",
              },
            ].map((feature, index) => (
              <div key={index}>
                <div
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${feature.color} p-8 border-l-4 ${feature.borderColor}`}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision and Mission */}
        <section
          className="mb-24"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Yoolkayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Himilada & Aragtida
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Waxaan ku dadaalnaa inaan hormarino waxbarashada ardayda
              Soomaaliyeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    Himilada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg">
                    Awoodsiinta ardayda Soomaaliyeed waxbarasho la heli karo oo
                    isdhexgal ah oo dhista fikirka qoto dheer iyo xirfadaha STEM
                    si ay ugu guuleystaan adduun tignoolajiyaddu hoggaamiso.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    Aragtida
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg">
                    Kacdoonka nidaamka dhijitaalka ah iyadoo la bixinayo
                    waxbarasho tayo leh oo awood u siinaysa ardayda Soomaaliyeed
                    inay ku kobcaan caalamka.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className="rounded-2xl bg-gradient-to-br from-gray-50 to-slate-100 p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Xiriir
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nala soo xiriir
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-8">
              Waxaan ku faraxsanahay inaan kaa jawaabno su&apos;aalohaaga ama aan kaa
              caawino wixii aad u baahan tahay
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                href="https://www.linkedin.com/company/garaad"
                target="_blank"
                aria-label="LinkedIn"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
              </Link>
              <Link
                href="https://x.com/Garaadstem"
                target="_blank"
                aria-label="Twitter"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
              </Link>
              <Link
                href="http://facebook.com/Garaadstem"
                target="_blank"
                aria-label="Facebook"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="mailto:Info@garaad.org" aria-label="Email">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href="mailto:Info@garaad.org"
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Info@garaad.org
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
