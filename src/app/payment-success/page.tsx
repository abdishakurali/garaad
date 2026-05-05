"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-6" strokeWidth={1.5} />

        <h1 className="text-display-md font-serif mb-4">
          You're in. Let's get to work.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-12">
          I'll see you inside. Your 30-day plan starts the moment
          you choose your path.
        </p>

        <ol className="text-left space-y-0 mb-12 divide-y divide-border border-t border-b border-border">
          {[
            { n: "1", text: "Choose your path: Freelancer, Worker, or Builder" },
            { n: "2", text: "Start Lesson 1 — it takes 20 minutes" },
            { n: "3", text: "Book your first 1:1 with me if you need it" },
          ].map(({ n, text }) => (
            <li key={n} className="flex gap-4 py-4">
              <span className="font-mono text-sm text-gold shrink-0 w-4 pt-0.5">{n}</span>
              <span className="text-sm text-foreground">{text}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/courses" className="btn-gold">
            Go to your plan →
          </Link>
          <Link href="/mentorship" className="btn-ghost">
            Book a 1:1 session
          </Link>
        </div>

      </div>
    </div>
  );
}
