"use client";

import Link from "next/link";

export default function AdminHomePage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 text-blue-800 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent tracking-tight">
                    Ku soo dhawoow Garaad Maamul
                </h1>
                <p className="text-gray-400 font-medium text-base">
                    Halkan waxaad ka maamuli kartaa dhammaan qaybaha Garaad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    href="/admin/cohorts"
                    className="group bg-violet-600 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-violet-500"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            🎓
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white leading-tight">
                                Kooxaha Challenge
                            </h2>
                            <p className="text-violet-100 text-[8px] font-black uppercase tracking-widest">
                                Cohorts & signups
                            </p>
                        </div>
                    </div>
                    <p className="text-violet-50 text-xs font-medium opacity-90">
                        Abuur koox, arag liiska, maamul diiwaangelinta ardayda
                    </p>
                </Link>

                <Link
                    href="/admin/post-verification-choice"
                    className="group bg-blue-600 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-500"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            📊
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white leading-tight">
                                Dashboard
                            </h2>
                            <p className="text-blue-100 text-[8px] font-black uppercase tracking-widest">Analytics</p>
                        </div>
                    </div>
                    <p className="text-blue-50 text-xs font-medium opacity-80">
                        Arag xogta guud ee platform-ka iyo analytics-ka
                    </p>
                </Link>

                <Link
                    href="/admin/qaybaha"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            📂
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                                Qaybaha
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Categories</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        Maamul qaybaha waxbarasho ee Garaad
                    </p>
                </Link>

                <Link
                    href="/admin/koorsooyinka"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            📚
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors leading-tight">
                                Koorsooyinka
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Courses</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        Maamul koorsooyinka waxbarasho
                    </p>
                </Link>

                <Link
                    href="/admin/casharada"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            📖
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-purple-700 transition-colors leading-tight">
                                Casharada
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Lessons</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        Maamul casharada iyo qeybaha
                    </p>
                </Link>

                <Link
                    href="/admin/blog"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            📰
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-orange-700 transition-colors leading-tight">
                                Blog-ga
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Blog Management</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        Maamul qoraalada blog-ga ee standalone-ka ah
                    </p>
                </Link>

                <Link
                    href="/admin/marketing"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            ✉️
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                                Marketing
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Email Campaigns</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        U dir email-lo dhamaan dadka iska diwaangeliyey Garaad
                    </p>
                </Link>
            </div>
        </div>
    );
}
