import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | Garaad',
    description: 'Privacy Policy for Garaad.org - How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="text-primary hover:underline text-sm font-medium mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground">
                        Effective as of February 6, 2026
                    </p>
                </div>

                {/* Quick Summary */}
                <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-6 mb-12">
                    <h2 className="text-xl font-bold text-foreground mb-3">Privacy Snapshot</h2>
                    <p className="text-foreground/80 leading-relaxed">
                        We collect only what we need to provide you with a great learning experience. We don't sell your data,
                        and we're transparent about how we use it. For children under 13, we comply with COPPA and require
                        parental consent.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">What We Collect</h2>

                        <h3 className="text-xl font-bold text-foreground mb-3 mt-6">Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Account Information:</strong> Name, email, age, profile picture</li>
                            <li><strong>Learning Data:</strong> Courses accessed, progress, answers, and interactions</li>
                            <li><strong>AI Chat Data:</strong> Your messages (text, voice, images) and AI responses</li>
                            <li><strong>Payment Information:</strong> Processed by our payment providers (we don't store card numbers)</li>
                            <li><strong>Communications:</strong> Messages you send us for support or feedback</li>
                        </ul>

                        <h3 className="text-xl font-bold text-foreground mb-3 mt-6">Voice Input</h3>
                        <p className="text-foreground/80 leading-relaxed">
                            If you use voice features:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>We require microphone permission (you can revoke this anytime)</li>
                            <li>Voice recordings are converted to text by a third-party service</li>
                            <li>We <strong>do not store</strong> your voice recordings—they're immediately discarded after transcription</li>
                            <li>Text transcriptions are treated like regular chat messages</li>
                        </ul>

                        <h3 className="text-xl font-bold text-foreground mb-3 mt-6">Automatic Data Collection</h3>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                            <li><strong>Usage Data:</strong> Pages viewed, features used, time spent</li>
                            <li><strong>Cookies:</strong> Small files that help us remember your preferences</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Provide the Service:</strong> Deliver lessons, track progress, personalize learning</li>
                            <li><strong>Improve Our Platform:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                            <li><strong>Communicate:</strong> Send important updates, respond to support requests</li>
                            <li><strong>AI Features:</strong> Process your inputs to generate responses and improve our AI tools</li>
                            <li><strong>Safety:</strong> Prevent fraud, enforce our terms, protect users</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4 font-semibold">
                            We do NOT use your AI chat data to train third-party AI models. We only use it to improve our own Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">How We Share Your Information</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We don't sell your personal information. We may share it with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Service Providers:</strong> Companies that help us operate (hosting, analytics, payment processing)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                            <li><strong>Business Transfers:</strong> If Garaad is acquired or merged with another company</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy (COPPA Compliance)</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We take children's privacy seriously and comply with the Children's Online Privacy Protection Act (COPPA):
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>For users under 13, we obtain verifiable parental consent before collecting personal information</li>
                            <li>Parents can review, delete, or refuse further collection of their child's information</li>
                            <li>We collect only what's necessary to provide the Service</li>
                            <li>We don't show ads to children or use their data for marketing</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            Parents can contact us at <a href="mailto:privacy@garaad.org" className="text-primary hover:underline">privacy@garaad.org</a> to
                            review or delete their child's information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Your Privacy Rights</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>Access:</strong> Request a copy of your personal information</li>
                            <li><strong>Correct:</strong> Update inaccurate information</li>
                            <li><strong>Delete:</strong> Request deletion of your data (including AI chat history)</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
                            <li><strong>Export:</strong> Download your data in a portable format</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            To exercise these rights, email us at <a href="mailto:privacy@garaad.org" className="text-primary hover:underline">privacy@garaad.org</a> or
                            use the data export feature in your account settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We use industry-standard security measures to protect your information, including encryption, secure servers,
                            and access controls. However, no system is 100% secure, so we can't guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We keep your information as long as your account is active or as needed to provide the Service.
                            You can request deletion at any time.
                        </p>
                        <p className="text-foreground/80 leading-relaxed">
                            <strong>Note:</strong> We retain AI chat conversations indefinitely unless you request deletion,
                            but we do not store voice recordings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We use cookies to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>Remember your login and preferences</li>
                            <li>Understand how you use the Platform</li>
                            <li>Improve our Service</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            You can disable cookies in your browser settings, but some features may not work properly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">International Users</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            Your information may be transferred to and stored in the United States. By using the Service,
                            you consent to this transfer.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            We may update this Privacy Policy from time to time. We'll notify you of significant changes by
                            email or through the Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                        <p className="text-foreground/80 leading-relaxed">
                            Questions or concerns about privacy? Contact us:
                        </p>
                        <div className="bg-muted/50 rounded-xl p-6 mt-4">
                            <p className="text-foreground/80">
                                <strong>Email:</strong> <a href="mailto:privacy@garaad.org" className="text-primary hover:underline">privacy@garaad.org</a>
                            </p>
                            <p className="text-foreground/80 mt-2">
                                <strong>Support:</strong> <a href="mailto:support@garaad.org" className="text-primary hover:underline">support@garaad.org</a>
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
