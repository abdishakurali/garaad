"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Banknote, Coins } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/features/authSlice';
import { selectCurrentUser } from '@/store/features/authSlice';

const PAYMENT_METHODS = [
    { key: "waafipay", label: "WaafiPay", icon: <Phone className="w-5 h-5" /> },
    { key: "bank", label: "Bangiga", icon: <Banknote className="w-5 h-5" /> },
    { key: "points", label: "Dhibcaha", icon: <Coins className="w-5 h-5" /> },
];

const PLAN_OPTIONS = [
    { key: "monthly", label: "Bixi Bil kasta", price: 20, note: "$20 / Bil kasta / Xubin" },
    { key: "annual", label: "Bixi Sanadkiiba", price: 16, note: "$16 / Bil kasta / Xubin", badge: "Keydi 15%" },
];

const ERROR_TRANSLATIONS: Record<string, string> = {
    "Payment Failed (Receiver is Locked)": "Bixinta waa guuldareysatay (Qofka qaataha waa la xidhay)",
    "Payment Failed (Haraaga xisaabtaadu kuguma filna, mobile No: 252618995283)": "Bixinta waa guuldareysatay (Haraaga xisaabtaadu kuguma filna, lambarka: 252618995283)",
    // Add more error translations as needed
};

function translateError(error: string) {
    for (const key in ERROR_TRANSLATIONS) {
        if (error.includes(key)) return ERROR_TRANSLATIONS[key];
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
        amount: "9.99",
        description: "Isdiiwaangeli Premium"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/payment", {
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Bixinta waa guuldareysatay");
            }

            if (data.success) {
                // Update Redux user state to is_premium: true
                if (currentUser) {
                    dispatch(setUser({ ...currentUser, is_premium: true }));
                }
                router.push("/dashboard");
            } else {
                setError(translateError(data.message || "Bixinta waa guuldareysatay"));
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
        setFormData((prev) => ({ ...prev, amount: "10" }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-2">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
                {/* Left: Payment Form */}
                <div className="flex-1">
                    <Card className="p-6 md:p-10">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold mb-2 text-purple-700">Kor u qaad Xubinnimadaada</CardTitle>
                            <CardDescription className="text-gray-600 mb-4">
                                Ku hel dhammaan casharrada, faylasha, iyo adeegyada dheeraadka ah oo xadidnayn la&apos;aan ah.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="accountNo">Lambarka WaafiPay</Label>
                                    <Input
                                        id="accountNo"
                                        name="accountNo"
                                        value={formData.accountNo}
                                        onChange={handleInputChange}
                                        placeholder="Geli lambarka WaafiPay"
                                        required
                                        pattern="[0-9]+"
                                        title="Fadlan geli lambarka saxda ah"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Habka Bixinta</Label>
                                    <div className="flex gap-2">
                                        {PAYMENT_METHODS.map((method) => (
                                            <button
                                                type="button"
                                                key={method.key}
                                                className={`flex-1 flex flex-col items-center justify-center border rounded-lg p-3 transition-all ${paymentMethod === method.key ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}
                                                onClick={() => setPaymentMethod(method.key)}
                                                disabled={method.key !== "waafipay"}
                                            >
                                                {method.icon}
                                                <span className="text-xs mt-1 font-medium">{method.label}</span>
                                                {method.key !== "waafipay" && (
                                                    <span className="text-[10px] text-gray-400">Dhowaan</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Lacagta (USD)</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                        disabled
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                                    Ka noqo
                                </Button>
                                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Waa la dirayaa...
                                        </>
                                    ) : (
                                        "Isdiiwaangeli"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
                {/* Right: Plan Summary */}
                <div className="w-full md:w-[350px]">
                    <Card className="p-6 md:p-8 bg-white/80">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold mb-2">Qorshaha Bilowga ah</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                {PLAN_OPTIONS.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={`flex items-center justify-between w-full border rounded-lg p-3 mb-2 transition-all ${plan === option.key ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}
                                        onClick={() => handlePlanChange(option.key)}
                                    >
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-sm text-gray-500">{option.note}</span>
                                        {option.badge && plan === option.key && (
                                            <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">{option.badge}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6 mb-2">
                                <span className="font-medium">Wadarta</span>
                                <span className="font-bold text-xl text-purple-700">${formData.amount} / Bil</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#a78bfa" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                <span>Hubi in dhammaan macaamilada si ammaan ah loo ilaaliyo.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 