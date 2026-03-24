'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Trophy, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
            <div className="p-6">
                <Link href="/" className="text-2xl font-bold text-primary">
                    Garaad
                </Link>
            </div>
            <nav className="mt-8">
                <Link
                    href="/courses"
                    className={`flex items-center justify-between gap-2 px-6 py-3 text-gray-600 hover:bg-gray-50 ${pathname === '/courses' ? 'bg-gray-50 text-primary' : ''}`}
                >
                    <span className="flex min-w-0 items-center">
                        <BookOpen className="w-5 h-5 mr-3 shrink-0" />
                        Koorsooyinka
                    </span>
                    <span
                        className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700"
                        title="Bilaash"
                    >
                        Bilaash
                    </span>
                </Link>
                <Link
                    href="/dashboard"
                    className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 ${pathname === '/dashboard' ? 'bg-gray-50 text-primary' : ''
                        }`}
                >
                    <Trophy className="w-5 h-5 mr-3" />
                    Guulaha
                </Link>
                <Link
                    href="/profile"
                    className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 ${pathname === '/profile' ? 'bg-gray-50 text-primary' : ''
                        }`}
                >
                    <Settings className="w-5 h-5 mr-3" />
                    Dejinta
                </Link>
                <button
                    className="flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                        if (typeof window !== "undefined") {
                            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            localStorage.clear();
                            router.push("/courses");
                        }
                    }}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Ka bax
                </button>
            </nav>
        </aside>
    );
} 