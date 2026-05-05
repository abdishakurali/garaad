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
          I'm Shakuur.<br />
          This is why I built Garaad.
        </h1>

        <div className="space-y-6 text-base text-muted-foreground leading-[1.85]">
          <p>
            I wrote my first line of code on a phone. No laptop, no desk, no teacher.
            Just curiosity and a YouTube video someone shared in a WhatsApp group.
          </p>
          <p>
            Everything was in English. Every tutorial assumed you had a MacBook,
            a bank account, and someone who could answer your questions.
            I had none of those things.
          </p>
          <p>
            The first time someone paid me for code I built, I couldn't sleep.
            Not because of the money — because I realized the gap wasn't skill.
            It was access. Information. Someone who had done it, showing you how.
          </p>
          <p>
            I built Garaad so that a kid in Mogadishu, or Minneapolis, or Dublin
            has someone in their language, showing them the actual path.
            Not theory. The real steps. The exact things I did.
          </p>
          <p className="text-foreground font-medium">
            I'm 22. I'm still building. I don't have all the answers.
            But I have the ones that matter for your first 60 days.
            And I'll be there when you need them.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <Link href="/subscribe" className="btn-gold">
            Join the Challenge →
          </Link>
          <Link href="/blog" className="btn-ghost">
            Read the blog →
          </Link>
        </div>

      </article>
    </main>
  );
}
