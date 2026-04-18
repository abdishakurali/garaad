import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers - Garaad',
  description: 'Join team Garaad - Waxbarasho Tayo Leh',
};

const roles = [
  {
    id: 'video-editor',
    title: 'Video Editor (AI-First)',
    department: 'Content',
    type: 'Full-time',
    location: 'Remote',
    summary: 'Soo saar videos leh retention sare (short + long form) si joogto ah. Isticmaal AI tools.',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-block text-purple-400 hover:text-purple-300 mb-8 font-medium"
        >
          ← Ku soo dhawow Garaad
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Careers
        </h1>
        <p className="text-xl text-slate-300 mb-12">
          Ku soo dhowow kooxda Garaad — Waxbarasho Tayo Leh 🦁
        </p>

        <div className="space-y-6">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={`/careers/${role.id}`}
              className="block bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-purple-500 hover:bg-slate-800 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {role.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                      {role.department}
                    </span>
                    <span>{role.type}</span>
                    <span>{role.location}</span>
                  </div>
                </div>
                <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                  Akhri tan →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700">
          <p className="text-slate-400">
            Have questions? {' '}
            <a href="mailto:info@garaad.org" className="text-purple-400 hover:underline">
              info@garaad.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}