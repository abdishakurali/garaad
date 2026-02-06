import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Use | Garaad',
    description: 'Terms of Use for Garaad.org - Simple, fair, and transparent terms for our learning platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="text-primary hover:underline text-sm font-medium mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
                        Terms of Use
                    </h1>
                    <p className="text-muted-foreground">
                        Effective as of February 6, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Garaad</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            These Terms of Use govern your access to and use of <strong>Garaad.org</strong> (the "Platform"),
                            including our website, mobile applications, and all related services (collectively, the "Service").
                            The Service is owned and operated by Garaad ("we," "us," or "our").
                        </p>
                        <p className="text-foreground/80 leading-relaxed">
                            By using the Service, you agree to these terms. If you don't agree, please don't use our Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Access to the Service</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            The Service is for your personal, non-commercial use. We may change, suspend, or discontinue any part
                            of the Service at any time without notice.
                        </p>
                        <h3 className="text-xl font-bold text-foreground mb-3 mt-6">Age Requirements</h3>
                        <p className="text-foreground/80 leading-relaxed">
                            If you are under 18, you must have permission from a parent or guardian to use the Service.
                            For users under 13, we comply with the Children's Online Privacy Protection Act (COPPA) and require
                            verifiable parental consent before collecting any personal information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Fees and Subscriptions</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            Basic access to Garaad is free. If you choose to subscribe to premium features:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>All fees are charged through your online account</li>
                            <li>Subscriptions automatically renew unless you cancel</li>
                            <li>You must cancel at least 1 business day before renewal to avoid charges</li>
                            <li>Fees are non-refundable except as required by law</li>
                            <li>We may change prices with notice to you</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            To cancel your subscription, email us at <a href="mailto:support@garaad.org" className="text-primary hover:underline">support@garaad.org</a> or
                            use the cancellation option in your account settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Your Content</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            When you submit content to the Platform (such as comments, solutions, or AI chat messages), you grant us
                            a license to use, display, and distribute that content to operate and improve the Service.
                        </p>
                        <p className="text-foreground/80 leading-relaxed">
                            You are responsible for your content and must ensure it:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Doesn't violate anyone's rights</li>
                            <li>Isn't harmful, offensive, or illegal</li>
                            <li>Doesn't contain false information</li>
                            <li>Is appropriate for all ages</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            We may remove any content that violates these terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. AI Features</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            Our AI-powered learning features may generate responses based on your input. Please note:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>AI responses may not always be accurate or complete</li>
                            <li>Don't share sensitive personal information with AI features</li>
                            <li>We use your interactions to improve our Service, but we don't train third-party AI models with your data</li>
                            <li>For voice features, we process audio to generate text transcriptions, then immediately discard the audio</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">5. What You Can't Do</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Scrape, copy, or harvest data from the Platform</li>
                            <li>Use the Service to train AI models without permission</li>
                            <li>Attempt to hack or breach our security</li>
                            <li>Impersonate others or create fake accounts</li>
                            <li>Use the Service for any illegal purpose</li>
                            <li>Interfere with other users' access to the Service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            All content on the Platform (lessons, problems, videos, designs) is protected by copyright and other laws.
                            You may use it for personal learning, but you can't copy, distribute, or create derivative works without our permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">7. Disclaimers</h2>
                        <p className="text-foreground/80 leading-relaxed font-semibold">
                            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DON'T GUARANTEE THAT:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>The Service will always be available or error-free</li>
                            <li>All content will be accurate or complete</li>
                            <li>The Service will meet your specific needs</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            To the maximum extent permitted by law, Garaad is not liable for any indirect, incidental, or consequential
                            damages arising from your use of the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">9. Dispute Resolution</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            If you have a concern, please contact us at <a href="mailto:support@garaad.org" className="text-primary hover:underline">support@garaad.org</a>.
                            We're committed to resolving issues fairly and quickly.
                        </p>
                        <p className="text-foreground/80 leading-relaxed">
                            These terms are governed by the laws of the United States. Any disputes will be resolved in the courts
                            of San Francisco, California.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to These Terms</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We may update these terms from time to time. We'll notify you of material changes by email or through the Platform.
                            Continued use of the Service after changes means you accept the new terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            Questions about these terms? Contact us at:
                        </p>
                        <div className="bg-muted/50 rounded-xl p-6 mt-4">
                            <p className="text-foreground/80">
                                <strong>Email:</strong> <a href="mailto:support@garaad.org" className="text-primary hover:underline">support@garaad.org</a>
                            </p>
                            <p className="text-foreground/80 mt-2">
                                <strong>Address:</strong> Garaad, San Francisco, CA
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
