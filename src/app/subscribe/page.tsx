"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Banknote, Coins } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, selectCurrentUser } from '@/store/features/authSlice';
import AuthService from "@/services/auth";

const PAYMENT_METHODS = [
    { key: "waafipay", label: "WaafiPay", icon: <Phone className="w-5 h-5" /> },
    { key: "bank", label: "Bangiga", icon: <Banknote className="w-5 h-5" /> },
    { key: "points", label: "Dhibcaha", icon: <Coins className="w-5 h-5" /> },
];

// Get prices from environment variables
const MONTHLY_PRICE = process.env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE || "10";
const ANNUAL_PRICE = process.env.NEXT_PUBLIC_SUBSCRIPTION_ANNUAL_PRICE || "100";

const PLAN_OPTIONS = [
    {
        key: "monthly",
        label: "Bixi Bil kasta",
        price: MONTHLY_PRICE,
        note: `$${MONTHLY_PRICE} / Bil kasta / Xubin`
    },
    {
        key: "annual",
        label: "Bixi Sanadkiiba",
        price: ANNUAL_PRICE,
        note: `$${ANNUAL_PRICE} / Sanadkiiba / Xubin`,
        badge: "Keydi 15%"
    },
];

const ERROR_TRANSLATIONS: Record<string, string> = {
    "Payment Failed (Receiver is Locked)": "Bixinta waa guuldareysatay (Qofka qaataha waa la xidhay)",
    "Payment Failed (Haraaga xisaabtaadu kuguma filna, mobile No: 252618995283)": "Bixinta waa guuldareysatay (Haraaga xisaabtaadu kuguma filna, lambarka: 252618995283)",
    "RCS_USER_REJECTED": "Bixinta waa la joojiyay adiga ayaa diiday",
    // Add more error translations as needed
};

function translateError(error: string) {
    for (const key in ERROR_TRANSLATIONS) {
        if (error.includes(key) || error === key) return ERROR_TRANSLATIONS[key];
    }
    return error;
}

export default function SubscribePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("waafipay");
    const [plan, setPlan] = useState("annual");
    const [formData, setFormData] = useState({
        accountNo: "",
        amount: ANNUAL_PRICE,
        description: "Isdiiwaangeli Premium"
    });

    // Check if user is already premium and redirect
    useEffect(() => {
        const authService = AuthService.getInstance();
        if (authService.isPremium()) {
            router.push("/dashboard");
        }
    }, [router]);

    // If user is premium, don't render the subscription form
    if (AuthService.getInstance().isPremium()) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // First, process the payment
            const paymentResponse = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accountNo: formData.accountNo,
                    amount: formData.amount,
                    description: formData.description
                }),
            });

            const paymentData = await paymentResponse.json();

            if (!paymentResponse.ok) {
                throw new Error(paymentData.message || "Bixinta waa guuldareysatay");
            }

            if (paymentData.success) {
                // If payment is successful, update the user's premium status
                const successResponse = await fetch("/api/payment/success", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionId: paymentData.data.params.transactionId,
                        referenceId: paymentData.data.params.referenceId,
                        state: paymentData.data.params.state,
                    }),
                });

                const successData = await successResponse.json();

                if (!successResponse.ok) {
                    throw new Error(successData.message || "Failed to update premium status");
                }

                if (successData.success) {
                    // Update Redux user state with the new premium status
                    if (currentUser) {
                        dispatch(setUser(successData.data.user));
                    }
                    router.push("/dashboard");
                } else {
                    setError(translateError(successData.message || "Failed to update premium status"));
                }
            } else {
                setError(translateError(paymentData.message || "Bixinta waa guuldareysatay"));
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? translateError(err.message)
                    : "Bixinta waa guuldareysatay"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Update amount when plan changes
    const handlePlanChange = (key: string) => {
        setPlan(key);
        const selectedPlan = PLAN_OPTIONS.find(option => option.key === key);
        setFormData((prev) => ({
            ...prev,
            amount: selectedPlan?.price || MONTHLY_PRICE
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-2">
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-24">
                {/* Left: Payment Form */}
                <div className="flex-1 min-w-0">
                    <Card className="p-0 overflow-hidden shadow-2xl border border-gray-100 bg-white rounded-3xl">
                        <div className="p-8 md:p-14">
                            <div className="flex flex-col items-center mb-8">
                                <img src="/logo.png" alt="Garaad Logo" className="h-14 w-auto mb-4 drop-shadow-md rounded-xl" />
                                <h1 className="text-4xl font-extrabold text-purple-700 mb-2 text-center">Kor u qaad Plus</h1>
                                <p className="text-gray-500 text-lg text-center">Ku hel blocks, faylal, iyo adeegyo aan xadidnayn.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Billed To */}
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Lagu xisaabi doono</h2>
                                    <Input
                                        placeholder="Magaca buuxa"
                                        className="w-full h-12 text-base bg-white"
                                        value={currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : ""}
                                        disabled
                                    />
                                </div>
                                {/* Payment Details */}
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Faahfaahinta Bixinta</h2>
                                    <div className="flex gap-3 flex-wrap mb-4">
                                        {PAYMENT_METHODS.map((method) => (
                                            <button
                                                type="button"
                                                key={method.key}
                                                className={`flex-1 min-w-[110px] flex flex-col items-center justify-center border rounded-xl p-4 transition-all text-base font-medium shadow-sm ${paymentMethod === method.key ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}
                                                onClick={() => setPaymentMethod(method.key)}
                                                disabled={method.key !== "waafipay"}
                                            >
                                                {method.icon}
                                                <span className="text-xs mt-1 font-semibold">{method.label}</span>
                                                {method.key !== "waafipay" && (
                                                    <span className="text-[10px] text-gray-400">Dhowaan</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            id="accountNo"
                                            name="accountNo"
                                            value={formData.accountNo}
                                            onChange={handleInputChange}
                                            placeholder="Lambarka WaafiPay (2526xxxxxxx)"
                                            required
                                            pattern="[0-9]+"
                                            title="Fadlan geli lambarka saxda ah"
                                            className="w-full h-12 text-base bg-white rounded-lg"
                                        />
                                    </div>
                                </div>
                                {/* Error */}
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {/* Action Buttons */}
                                <div className="flex gap-4 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 rounded-lg"
                                        onClick={() => router.back()}
                                    >
                                        Ka noqo
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Waa la dirayaa...
                                            </>
                                        ) : (
                                            "Isdiiwaangeli"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
                {/* Right: Plan Summary */}
                <div className="w-full md:w-[380px] flex-shrink-0">
                    <Card className="p-0 overflow-hidden bg-white/90 shadow-lg border border-gray-100 rounded-2xl">
                        <div className="p-8 md:p-10">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Qorshaha Bilowga ah</h2>
                            <div className="flex flex-col gap-4 mb-8">
                                {PLAN_OPTIONS.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={`flex items-center justify-between w-full border rounded-xl p-4 mb-2 transition-all text-base font-medium shadow-sm ${plan === option.key ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}
                                        onClick={() => handlePlanChange(option.key)}
                                    >
                                        <span className="font-semibold">{option.label}</span>
                                        <span className="text-sm text-gray-500">{option.note}</span>
                                        {option.badge && plan === option.key && (
                                            <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">{option.badge}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Wadarta</span>
                                <span className="font-bold text-2xl text-purple-700">${formData.amount} / {plan === 'monthly' ? 'Bil' : 'Sanad'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#a78bfa" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                <span>Hubi in dhammaan macaamilada si ammaan ah loo ilaaliyo.</span>
                            </div>
                            <div className="mt-8 text-xs text-gray-400">
                                Marka aad bixiso macluumaadkaaga, waxaad ogolaatay in mustaqbalka lagaa jari karo si waafaqsan shuruudaha adeegga.
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
} 