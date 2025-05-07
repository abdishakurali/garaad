"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Twitter, ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Save the SVG locally and use it from public directory
const HERO_IMAGE = "/images/earth-and-satellite.svg";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
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
                Iyadoo la adeegsanayo hal-abuurka
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
            <motion.div
              className="lg:w-1/2 relative h-[300px] sm:h-[400px]"
              animate={{
                y: [0, 10, 0],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Image
                src={HERO_IMAGE || "/placeholder.svg"}
                alt="Garaad Global Learning"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Core Values Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
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
                  "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan.",
              },
              {
                title: "Xawaare",
                icon: "⚡",
                description:
                  "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna.",
              },
              {
                title: "Mas'uuliyad",
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
              <motion.div key={index} variants={fadeIn} className="h-full">
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
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What Makes Us Special Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
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
                color: "bg-gradient-to-br from-emerald-50 to-teal-50",
                borderColor: "border-l-emerald-400",
              },
              {
                title: "Diiradda saaraya xallinta dhibaatooyinka",
                description:
                  "Koorsooyinkayagu waxay xoogga saaraan waxbarashada ku saleysan ficilka iyo fikirka qoto dheer.",
                color: "bg-gradient-to-br from-sky-50 to-blue-50",
                borderColor: "border-l-sky-400",
              },
              {
                title: "Isticmaal xog yar",
                description:
                  "Waxaan jebineynaa caqabadaha helitaanka anagoo naqshadeynayna barxad isticmaalka xogta yaraysa.",
                color: "bg-gradient-to-br from-amber-50 to-yellow-50",
                borderColor: "border-l-amber-400",
              },
              {
                title: "Dhismaha bulsho",
                description:
                  "Waxaan dhiseynaa nidaam taageero oo ardayda Soomaaliyeed ay ku xiriiri karaan.",
                color: "bg-gradient-to-br from-rose-50 to-pink-50",
                borderColor: "border-l-rose-400",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <div
                  className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${feature.color} p-8 border-l-4 ${feature.borderColor}`}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vision and Mission */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
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
            <motion.div variants={fadeIn}>
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
            </motion.div>

            <motion.div variants={fadeIn}>
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
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
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
              Waxaan ku faraxsanahay inaan kaa jawaabno su'aalahaaga ama aan kaa
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
        </motion.section>
      </main>
    </div>
  );
}
