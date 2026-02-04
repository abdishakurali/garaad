"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTIONS = [
    { key: "home", label: "Home", icon: "🏠", path: "/admin" },
    { key: "dashboard", label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { key: "qaybaha", label: "Qaybaha", icon: "📂", path: "/admin/qaybaha" },
    { key: "koorsooyinka", label: "Koorsooyinka", icon: "📚", path: "/admin/koorsooyinka" },
    { key: "casharada", label: "Casharada", icon: "📖", path: "/admin/casharada" },
    { key: "muuqaalada", label: "Muuqaalada", icon: "🎥", path: "/admin/muuqaalada" },
    { key: "sualaha", label: "Su'aalaha", icon: "❓", path: "/admin/sualaha" },
];

interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Logo section - only visible on desktop */}
            <Link href="/admin" className={`hidden lg:flex items-center gap-3 p-6 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <img src="https://www.garaad.org/favicon.ico" alt="Garaad Logo" className="w-6 h-6" />
                </div>
                {!isCollapsed && (
                    <span className="font-bold text-xl bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent truncate">
                        Garaad Maamul
                    </span>
                )}
            </Link>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <div className="space-y-1.5">
                    {SECTIONS.map((s) => {
                        const isActive = pathname === s.path;
                        return (
                            <Link
                                key={s.key}
                                href={s.path}
                                className={`
                                    group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                    transition-all duration-200 ease-in-out
                                    ${isActive
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }
                                    ${isCollapsed ? 'justify-center px-0' : ''}
                                `}
                                title={s.label}
                            >
                                <span className={`
                                    flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                                    transition-all duration-200 ease-in-out
                                    ${isActive
                                        ? "bg-white shadow-sm text-blue-600"
                                        : "bg-gray-50 text-gray-600 group-hover:bg-white group-hover:shadow-sm"
                                    }
                                `}>
                                    {s.icon}
                                </span>
                                {!isCollapsed && <span className="flex-1 truncate">{s.label}</span>}

                                {/* Active indicator */}
                                {isActive && !isCollapsed && (
                                    <span className="absolute right-2 w-1.5 h-6 bg-blue-600 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer with collapse toggle */}
            <div className={`p-4 border-t border-gray-100 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                        👤
                    </span>
                    {!isCollapsed && <span className="font-bold truncate">Maamulaha</span>}
                </div>

                <button
                    onClick={onToggle}
                    className={`hidden lg:flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-white flex-shrink-0">
                        {isCollapsed ? "»" : "«"}
                    </span>
                    {!isCollapsed && <span>Halkaan ka xir</span>}
                </button>
            </div>
        </div>
    );
}
