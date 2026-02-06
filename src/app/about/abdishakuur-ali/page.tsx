import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Garaad',
  description: 'Learn about Garaad\'s mission to systemize STEM education for the Somali generation through radical truth and merit-based learning.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
