'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Gift, Check, Send, GraduationCap, Banknote, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { generateReferralLink, type ReferralLink } from '@/services/referral';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
    const { toast } = useToast();
    const [referralData, setReferralData] = useState<ReferralLink | null>(null);
    const [loading, setLoading] = useState(false);
    const [copying, setCopying] = useState(false);

    // Load referral link when modal opens
    useEffect(() => {
        if (isOpen && !referralData) {
            loadReferralLink();
        }
    }, [isOpen]);

    const loadReferralLink = async () => {
        try {
            setLoading(true);
            const data = await generateReferralLink();
            setReferralData(data);
        } catch (error) {
            console.error('Failed to load referral link:', error);
            toast({
                variant: 'destructive',
                title: 'Khalad ayaa dhacay',
                description: 'Codsiga link-ga casuumada waa laga diiday.',
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!referralData) return;

        try {
            setCopying(true);
            await navigator.clipboard.writeText(referralData.referral_link);
            setTimeout(() => setCopying(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const shareViaWhatsApp = () => {
        if (!referralData) return;
        const message = `Ku soo biir Garaad oo wax la baro! ${referralData.referral_link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const shareViaTelegram = () => {
        if (!referralData) return;
        const message = `Ku soo biir Garaad oo wax la baro! ${referralData.referral_link}`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralData.referral_link)}&text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-slate-50 dark:bg-slate-900 rounded-[2rem] max-h-[90vh]">
                <div className="relative p-6 pt-8 space-y-6">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-primary/10 rounded-full blur-3xl" />

                    <DialogHeader className="relative text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-1">
                            <GraduationCap className="w-6 h-6 text-primary animate-bounce-subtle" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            La Wada Fursadda, Kasbina Dakhli
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                            U dir saaxiibkaaga raba inuu wax barto, adna hel dakhli!
                        </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary/20 border-t-primary" />
                            <p className="text-xs text-slate-400 font-bold animate-pulse">Raadinaya...</p>
                        </div>
                    ) : referralData ? (
                        <div className="space-y-6 relative">
                            {/* Educational Info Box - Horizontal Steps */}
                            <div className="border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 bg-white/50 dark:bg-slate-800/50">
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 text-center">💡 SIDE AYAY U SHAQEYSAA?</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { step: "1", title: "Dir Link", desc: "U dir saaxiibkaa" },
                                        { step: "2", title: "Qiimo Dhimis", desc: "Isaga: 20% Off" },
                                        { step: "3", title: "Dakhli", desc: "Adna: 20% Com" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center space-y-2">
                                            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                                                {item.step}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black dark:text-white leading-none">{item.title}</p>
                                                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Link & Share Section - Consolidated */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 pl-3">
                                        <code className="flex-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                                            {referralData.referral_link}
                                        </code>
                                        <Button
                                            onClick={copyToClipboard}
                                            disabled={copying}
                                            size="sm"
                                            className={`rounded-lg h-8 px-3 text-[10px] font-bold transition-all ${copying ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                                        >
                                            {copying ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            <span className="ml-1.5">{copying ? 'La koobiyeyay' : 'Koobiyee'}</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={shareViaWhatsApp}
                                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl h-10 text-[11px] font-black shadow-lg shadow-[#25D366]/10"
                                    >
                                        <Share2 className="w-3.5 h-3.5 mr-1.5" />
                                        WhatsApp
                                    </Button>
                                    <Button
                                        onClick={shareViaTelegram}
                                        className="bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-xl h-10 text-[11px] font-black shadow-lg shadow-[#0088cc]/10"
                                    >
                                        <Send className="w-3.5 h-3.5 mr-1.5" />
                                        Telegram
                                    </Button>
                                </div>
                            </div>

                            {/* Footer Info */}
                            <div className="flex flex-col items-center space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                    Ku billow kasbashada maanta!
                                </p>
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        onClose();
                                        window.location.href = '/referrals';
                                    }}
                                    className="text-primary font-black text-[10px] h-auto p-0 flex items-center gap-1.5 hover:no-underline opacity-80 hover:opacity-100"
                                >
                                    <TrendingUpIcon className="w-3 h-3" />
                                    Fiiri inta aad Kasbatay Hada
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
