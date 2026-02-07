'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getReferralDashboard, type ReferralDashboard } from '@/services/referral';
import { Copy, Users, DollarSign, TrendingUp, GraduationCap, Share2, ArrowRight, Banknote, Star, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

export default function ReferralsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated } = useAuthStore();
    const [dashboard, setDashboard] = useState<ReferralDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [copying, setCopying] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/welcome');
            return;
        }

        loadDashboard();
    }, [isAuthenticated]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await getReferralDashboard();
            setDashboard(data);
        } catch (error) {
            console.error('Failed to load referral dashboard:', error);
            toast({
                variant: 'destructive',
                title: 'Khalad ayaa dhacay',
                description: 'Lagu guuldareystay in la soo raro xogta dashboard-ka.',
            });
        } finally {
            setLoading(false);
        }
    };

    const copyReferralLink = async () => {
        if (!dashboard) return;

        try {
            setCopying(true);
            await navigator.clipboard.writeText(dashboard.referral_link);
            toast({
                title: 'Waa la koobiyeeyay! 🎉',
                description: 'Link-gaaga casuumada waa uu diyaar yahay.',
                // The original edit had a syntax error here.
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Khalad ayaa dhacay',
                description: 'Lama koobiyeyn karo link-ga.',
            });
        } finally {
            setCopying(false);
        }
    };

    const shareViaWhatsApp = () => {
        if (!dashboard) return;
        const message = `Ku soo biir Garaad oo wax la baro! ${dashboard.referral_link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Xogta lama helin</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
                        <GraduationCap className="w-10 h-10 text-primary animate-bounce-subtle" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">

                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">
                        "U dir saaxiibkaaga raba inuu wax barto, adna hel dakhli dheeraad ah marwalba!"
                    </p>
                </div>

                {/* Main Action Card - High Contrast */}
                <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-900/50 border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10" />
                    <div className="relative p-8 md:p-12 flex flex-col items-center text-center space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold text-white">Share the Opportunity</h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Marwalba oo saaxiibkaaga uu koorso iibsado, waxaad heli doontaa 20% komishan.
                                Isla markaana saaxiibkaaga wuxuu helayaa 20% qiimo-dhimis gaar ah!
                            </p>
                        </div>

                        <div className="w-full max-w-xl space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl h-14 flex items-center px-4 overflow-hidden group/link">
                                    <code className="text-primary-foreground/70 font-mono text-sm truncate flex-1 text-left">
                                        {dashboard.referral_link}
                                    </code>
                                    <button
                                        onClick={copyReferralLink}
                                        className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={shareViaWhatsApp}
                                    className="bg-green-600 hover:bg-green-700 h-14 rounded-2xl px-8 font-bold text-white shadow-lg shadow-green-900/20"
                                >
                                    <Share2 className="w-5 h-5 mr-2" />
                                    WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Minimal Glassmorphism */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Wadarta Lacagta',
                            value: `$${dashboard.total_earnings}`,
                            sub: `Sugaya: $${dashboard.pending_earnings}`,
                            icon: DollarSign,
                            color: 'text-emerald-500',
                            bg: 'bg-emerald-500/10'
                        },
                        {
                            label: 'Dadka Casuuman',
                            value: dashboard.total_referred,
                            sub: `Ishtiraak: ${dashboard.subscribed_count}`,
                            icon: Users,
                            color: 'text-blue-500',
                            bg: 'bg-blue-500/10'
                        },
                        {
                            label: 'Heerka Beddelka',
                            value: `${dashboard.conversion_rate}%`,
                            sub: 'Ishtiraak / Dadka',
                            icon: TrendingUp,
                            color: 'text-purple-500',
                            bg: 'bg-purple-500/10'
                        },
                        {
                            label: 'Dhibcaha Garaad',
                            value: dashboard.referral_points,
                            sub: 'Points accumulated',
                            icon: Trophy,
                            color: 'text-orange-500',
                            bg: 'bg-orange-500/10'
                        },
                    ].map((stat, i) => (
                        <Card key={i} className="border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-8 space-y-4">
                                <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={clsx("w-6 h-6", stat.color)} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">{stat.sub}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Rewards */}
                    <Card className="border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] shadow-sm">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Lacagaha Ugu Dambeeyay</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            {dashboard.recent_rewards.length > 0 ? (
                                dashboard.recent_rewards.map((reward) => (
                                    <div key={reward.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/5 group transition-colors hover:bg-white/50 dark:hover:bg-white/10">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white">{reward.referred_user_username}</p>
                                            <p className="text-xs text-slate-400">{new Date(reward.created_at).toLocaleDateString('so-SO')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-emerald-500">+${reward.reward_amount}</p>
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider rounded-lg border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-2">
                                                {reward.status === 'pending' ? 'Sugaya' : reward.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-12 text-slate-400 italic">Wali ma heli lacag casuumad ah.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Referred Users */}
                    <Card className="border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] shadow-sm">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Dadka aad Casuuntay</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            {dashboard.referred_users.length > 0 ? (
                                dashboard.referred_users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{user.username}</p>
                                                <p className="text-xs text-slate-400">Ku biiray: {new Date(user.created_at).toLocaleDateString('so-SO')}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-12 text-slate-400 italic">Wali ma jiraan dad aad casuuntay.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Motivational Footer */}
                <div className="text-center pb-12">
                    <p className="text-slate-400 font-bold mb-2">
                        Ku billow kasbashada maanta! Lacagtaada si fudud ugu qaado xisaabtaada.
                    </p>
                    <div className="flex justify-center gap-2">
                        <Badge variant="outline" className="border-primary/20 text-primary">Safe Payments</Badge>
                        <Badge variant="outline" className="border-primary/20 text-primary">24/7 Support</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
