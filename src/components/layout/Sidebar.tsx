import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Trophy, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();

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
                    className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 ${pathname === '/courses' ? 'bg-gray-50 text-primary' : ''}`}
                >
                    <BookOpen className="w-5 h-5 mr-3" />
                    Koorsooyinka
                </Link>
                <Link
                    href="/achievements"
                    className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 ${pathname === '/achievements' ? 'bg-gray-50 text-primary' : ''
                        }`}
                >
                    <Trophy className="w-5 h-5 mr-3" />
                    Guulaha
                </Link>
                <Link
                    href="/settings"
                    className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 ${pathname === '/settings' ? 'bg-gray-50 text-primary' : ''
                        }`}
                >
                    <Settings className="w-5 h-5 mr-3" />
                    Dejinta
                </Link>
                <button
                    className="flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                        if (typeof window !== "undefined") {
                            // Clear session markers
                            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            localStorage.clear();
                            window.location.href = "/";
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