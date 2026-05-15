"use client";

import Link from "next/link";

const SECTIONS = [
    {
        href: "/admin/users",
        bg: "bg-blue-600 border-blue-500",
        textColor: "text-white",
        subColor: "text-blue-100",
        descColor: "text-blue-50",
        icon: "👥",
        title: "Isticmaalayaasha",
        sub: "Users",
        desc: "Arag liiska, taariikhda lacag-bixinta, iyo xaaladda membership",
    },
    {
        href: "/admin/cohorts",
        bg: "bg-violet-600 border-violet-500",
        textColor: "text-white",
        subColor: "text-violet-100",
        descColor: "text-violet-50",
        icon: "🎓",
        title: "Kooxaha",
        sub: "Cohorts",
        desc: "Abuur koox, arag liiska, maamul diiwaangelinta ardayda",
    },
    {
        href: "/admin/casharada",
        bg: "bg-white border-gray-100",
        textColor: "text-gray-800",
        subColor: "text-gray-400",
        descColor: "text-gray-500",
        icon: "📖",
        title: "Casharada",
        sub: "Lessons",
        desc: "Ku dar, tafatir, oo daabac casharro cusub",
        hoverText: "group-hover:text-purple-700",
        iconBg: "bg-purple-50",
    },
    {
        href: "/admin/koorsooyinka",
        bg: "bg-white border-gray-100",
        textColor: "text-gray-800",
        subColor: "text-gray-400",
        descColor: "text-gray-500",
        icon: "📚",
        title: "Koorsooyinka",
        sub: "Courses / Weeks",
        desc: "Maamul toddobaadyada iyo koorsooyinka waddooyinka",
        hoverText: "group-hover:text-emerald-700",
        iconBg: "bg-emerald-50",
    },
    {
        href: "/admin/qaybaha",
        bg: "bg-white border-gray-100",
        textColor: "text-gray-800",
        subColor: "text-gray-400",
        descColor: "text-gray-500",
        icon: "📂",
        title: "Qaybaha",
        sub: "Categories",
        desc: "Maamul qaybaha waxbarasho ee Garaad",
        hoverText: "group-hover:text-blue-700",
        iconBg: "bg-blue-50",
    },
    {
        href: "/admin/blog",
        bg: "bg-white border-gray-100",
        textColor: "text-gray-800",
        subColor: "text-gray-400",
        descColor: "text-gray-500",
        icon: "📰",
        title: "Blog-ga",
        sub: "Blog",
        desc: "Maamul qoraalada blog-ga",
        hoverText: "group-hover:text-orange-700",
        iconBg: "bg-orange-50",
    },
    {
        href: "/admin/marketing",
        bg: "bg-white border-gray-100",
        textColor: "text-gray-800",
        subColor: "text-gray-400",
        descColor: "text-gray-500",
        icon: "✉️",
        title: "Marketing",
        sub: "Email Campaigns",
        desc: "U dir email-lo dhamaan dadka iska diwaangeliyey Garaad",
        hoverText: "group-hover:text-blue-700",
        iconBg: "bg-blue-50",
    },
];

export default function AdminHomePage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent tracking-tight">
                    Ku soo dhawoow Garaad Maamul
                </h1>
                <p className="text-gray-400 font-medium text-base">
                    Halkan waxaad ka maamuli kartaa dhammaan qaybaha Garaad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className={`group ${s.bg} rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border`}
                    >
                        <div className="flex items-center gap-3.5 mb-3">
                            <div className={`w-12 h-12 rounded-xl ${s.iconBg ?? "bg-white/10"} flex items-center justify-center text-2xl group-hover:scale-105 transition-transform`}>
                                {s.icon}
                            </div>
                            <div>
                                <h2 className={`text-xl font-black ${s.textColor} ${s.hoverText ?? ""} transition-colors leading-tight`}>
                                    {s.title}
                                </h2>
                                <p className={`${s.subColor} text-[8px] font-black uppercase tracking-widest`}>
                                    {s.sub}
                                </p>
                            </div>
                        </div>
                        <p className={`${s.descColor} text-xs font-medium opacity-90`}>
                            {s.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
