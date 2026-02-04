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
                    href="/admin/dashboard"
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
                    href="/admin/muuqaalada"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            🎥
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-rose-700 transition-colors leading-tight">
                                Muuqaalada
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Videos</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        Maamul iyo soo geli muuqaalada
                    </p>
                </Link>

                <Link
                    href="/admin/sualaha"
                    className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                            ❓
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 group-hover:text-amber-700 transition-colors leading-tight">
                                Su'aalaha
                            </h2>
                            <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Questions</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">
                        Maamul su'aalaha iyo dhibaatooyinka
                    </p>
                </Link>
            </div>
        </div>
    );
}
