import { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Abdishakur Ali — Founder of Garaad",
  description:
    "I'm Shakuur. 22 years old, Dublin. I built Garaad because I couldn't find what I needed in Somali. Now I'm showing exactly what I did.",
  alternates: { canonical: `${SITE_URL}/about/abdishakuur-ali` },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/about/abdishakuur-ali`,
    title: "Abdishakur Ali — Founder of Garaad",
    description: "Founder of Garaad. Self-taught. 22. Dublin. Building in Somali.",
    images: [{ url: `${SITE_URL}/images/og-main.jpg`, width: 1200, height: 630 }],
  },
};

export default function FounderPage() {
  return (
    <main className="bg-background text-foreground pt-14">
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-28">

        <h1 className="text-display-md sm:text-display-lg font-serif mb-12 leading-tight">
          Magacaygu waa Shakuur.<br />
          Tani waa sababta aan u dhisay Garaad.
        </h1>

        <div className="space-y-6 text-base text-muted-foreground leading-[1.85]">
          <p>
            Khadkaygii ugu horreeyay ee koodh ah (code) waxaan ku qoray talefan. Ma aanan haysan laptop, miis, iyo macallin midna. Waxaa kaliya oo i waday hirow iyo muuqaal YouTube ah oo qof uu ku soo dhex riday koox WhatsApp ah.
          </p>
          <p>
            Wax kastaaba waxay ku qornaayeen Ingiriis. Cashar kasta oo aan daawado wuxuu u qaatay in aad haysato MacBook, xisaab bangi, iyo qof aad waydiiso wixii kugu adkaada. Anigu midna ma aanan haysan waxyaabahaas.
          </p>
          <p>
            Markii ugu horraysay ee qof uu lacag igu siiyo koodh aan dhisay, habeenkaas ma aanan seexan. Ma ahayn lacagta darteed — laakiin waxay ahayd waayo-aragnimada aan ka helay in farqigu uusan ahayn xirfadda, balse uu yahay fursadda. Waa helidda macluumaadka iyo qof horay u soo qabtay oo ku tusaya sida wax loo qabto.
          </p>
          <p>
            Garaad waxaan u dhisay si uu wiilka jooga Muqdisho, Minneapolis, ama Dublin u helo qof kula hadlaya luqaddiisa, oo tusaya jidka saxda ah. Ma ahan aragti kale, ee waa tallaabooyinka dhabta ah. Waxyaabihii saxda ahaa ee aan anigu soo maray.
          </p>
          <p className="text-foreground font-medium">
            Wali wax baan dhisayaa. Ma hayo jawaabaha oo dhan, laakiin waxaan hayyaa kuwa muhiimka u ah 60-kaaga cisho ee ugu horreeya. Waxaanan garabkaaga joogi doonaa markaad ii baahato.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link href="/subscribe" className="btn-gold">
            Ku soo biir Mentorship-ka →
          </Link>
          <Link href="/blog" className="btn-ghost">
            Read the blog →
          </Link>
        </div>

      </article>
    </main>
  );
}
