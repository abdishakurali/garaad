"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users } from "lucide-react";
import Logo from '../ui/Logo';

const NAV_ITEMS = [
    { key: "home", label: "Home", icon: "⌂", path: "/admin" },
    { key: "dashboard", label: "Dashboard", icon: "▦", path: "/admin/post-verification-choice" },
    { key: "users", label: "Isticmaalayaasha", icon: "users", path: "/admin/users" },
    { key: "cohorts", label: "Kooxaha", icon: "◎", path: "/admin/cohorts" },
    { key: "qaybaha", label: "Qaybaha", icon: "◫", path: "/admin/qaybaha" },
    { key: "koorsooyinka", label: "Koorsooyinka", icon: "◎", path: "/admin/koorsooyinka" },
    { key: "casharada", label: "Casharada", icon: "≡", path: "/admin/casharada" },
    { key: "blog", label: "Blog", icon: "▤", path: "/admin/blog" },
    { key: "webinars", label: "Webinars", icon: "◎", path: "/admin/webinars" },
    { key: "marketing", label: "Marketing", icon: "◈", path: "/admin/marketing" },
];

interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100">
            {/* Logo */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center px-4 py-5' : 'px-5 py-5'}`}>
                {isCollapsed ? (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">G</div>
                ) : (
                    <Logo
                        width={110}
                        height={32}
                        className="h-8 w-auto"
                        priority={true}
                        loading="eager"
                        sizes="110px"
                    />
                )}
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-gray-100 mb-2" />

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto py-2 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                <div className="space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            pathname === item.path ||
                            (item.path !== "/admin" && pathname.startsWith(`${item.path}/`));
                        return (
                            <Link
                                key={item.key}
                                href={item.path}
                                title={item.label}
                                className={`
                                    flex items-center gap-3 rounded-lg transition-all duration-150
                                    ${isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'}
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {/* Icon */}
                                {item.icon === "users" ? (
                                    <Users className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} aria-hidden />
                                ) : (
                                    <span className={`
                                        flex-shrink-0 text-base leading-none font-bold
                                        ${isActive ? 'text-blue-600' : 'text-gray-400'}
                                    `}>
                                        {item.icon}
                                    </span>
                                )}

                                {/* Label */}
                                {!isCollapsed && (
                                    <span className={`text-sm font-medium tracking-[-0.01em] ${isActive ? 'text-blue-700' : ''}`}>
                                        {item.label}
                                    </span>
                                )}

                                {/* Active dot */}
                                {isActive && !isCollapsed && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className={`p-3 border-t border-gray-100 ${isCollapsed ? 'px-2' : ''}`}>
                <button
                    onClick={onToggle}
                    className={`
                        hidden lg:flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
                        text-gray-400 hover:text-gray-600 hover:bg-gray-50
                        transition-all duration-150
                        ${isCollapsed ? 'justify-center px-0' : ''}
                    `}
                >
                    <span className="text-xs font-bold">
                        {isCollapsed ? '→' : '←'}
                    </span>
                    {!isCollapsed && <span className="text-xs text-gray-400">Xir</span>}
                </button>
            </div>
        </div>
    );
}
