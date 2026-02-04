"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/admin/auth";
import { adminApi as api, ApiError } from "@/lib/admin-api";
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_premium: boolean;
    is_superuser: boolean;
    has_completed_onboarding: boolean;
}

interface LoginResponse {
    tokens: {
        access: string;
        refresh: string;
    };
    user: User;
}

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { setTokens, token } = useAdminAuthStore();

    useEffect(() => {
        if (token) {
            router.replace("/admin");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post<LoginResponse>("auth/signin/", { email, password });
            const { tokens, user } = res.data;

            if (tokens.access && tokens.refresh) {
                if (!user.is_superuser) {
                    setError("Only admin users can access this panel");
                    return;
                }

                setTokens(tokens.access, tokens.refresh, user);
                router.replace("/admin");
            } else {
                throw new Error("Invalid response format - missing tokens");
            }
        } catch (err: unknown) {
            console.error("Login error:", err);
            const apiError = err as ApiError;

            if (apiError.response?.status === 401 || apiError.response?.status === 403) {
                setError("Email ama password-ka ayaa khaldan");
            } else if (apiError.response?.data?.message) {
                setError(apiError.response.data.message);
            } else if (apiError.response?.data?.detail) {
                setError(apiError.response.data.detail);
            } else {
                setError("Khalad ayaa dhacay intii lagu guda jiray soo gelitaanka");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-gray-50 p-10 md:p-12">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100 mb-6">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Garaad Maamul</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Administrative Access Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Emailka</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                                    placeholder="maamul@garaad.org"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sirta (Password)</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full h-16 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="uppercase tracking-widest text-xs">Ficilku wuu socdaa...</span>
                                </>
                            ) : (
                                <span className="uppercase tracking-widest text-xs">Soo Gal Maamulka</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} Garaad Learning Management
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
