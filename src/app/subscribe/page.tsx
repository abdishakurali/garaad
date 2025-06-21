"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Banknote, Coins, CreditCard } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, selectCurrentUser } from '@/store/features/authSlice';
import AuthService from "@/services/auth";

const PAYMENT_METHODS = [
    { key: "waafipay", label: "WaafiPay", icon: <Phone className="w-5 h-5" /> },
    { key: "card", label: "Kaarka", icon: <CreditCard className="w-5 h-5" /> },
    { key: "bank", label: "Bangiga", icon: <Banknote className="w-5 h-5" /> },
    { key: "points", label: "Dhibcaha", icon: <Coins className="w-5 h-5" /> },
];

// Get prices from environment variables
const MONTHLY_PRICE = process.env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE || "10";
const ANNUAL_PRICE = process.env.NEXT_PUBLIC_SUBSCRIPTION_ANNUAL_PRICE || "100";

const PLAN_OPTIONS = [
    {
        key: "monthly",
        label: "Bille",
        price: MONTHLY_PRICE,
        note: `$${MONTHLY_PRICE} / Bil kasta / Xubin`
    },
    {
        key: "annual",
        label: "Sanadle",
        price: ANNUAL_PRICE,
        note: `$${ANNUAL_PRICE} / Sanadkiiba / Xubin`,
        badge: "Keydi 15%"
    },
];

const ERROR_TRANSLATIONS: Record<string, string> = {
    "Payment Failed (Receiver is Locked)": "Bixinta waa guuldareysatay (Qofka qaataha waa la xidhay)",
    "Payment Failed (Haraaga xisaabtaadu kuguma filna, mobile No: 252618995283)": "Bixinta waa guuldareysatay (Haraaga xisaabtaadu kuguma filna, lambarka: 252618995283)",
    "RCS_USER_REJECTED": "Bixinta waa la joojiyay adiga ayaa diiday",
    "Invalid card number": "Lambarka kaarka waa khaldan",
    "Invalid or expired card": "Kaarka waa khaldan ama waa dhammaystiran",
    "Invalid CVV": "CVV-ga waa khaldan",
    // Add more error translations as needed
};

function translateError(error: string) {
    for (const key in ERROR_TRANSLATIONS) {
        if (error.includes(key) || error === key) return ERROR_TRANSLATIONS[key];
    }
    return error;
}

const WALLET_TYPES = [
    { key: "MWALLET_EVC", label: "EVC Plus" },
    { key: "MWALLET_ZAAD", label: "ZAAD" },
    { key: "MWALLET_SAHAL", label: "SAHAL" },
    { key: "MWALLET_WAAFI", label: "WAAFI" },
    { key: "MWALLET_BANKACCOUNT", label: "Bank Account" },
];

const CARD_ICONS: Record<string, React.ReactNode> = {
    VISA: <svg className="h-6 w-8" viewBox="0 0 48 32"><text x="0" y="24" fontSize="24">💳</text></svg>,
    MASTERCARD: <svg className="h-6 w-8" viewBox="0 0 48 32"><text x="0" y="24" fontSize="24">🟠🟠</text></svg>,
    AMEX: <svg className="h-6 w-8" viewBox="0 0 48 32"><text x="0" y="24" fontSize="24">🟦</text></svg>,
    DISCOVER: <svg className="h-6 w-8" viewBox="0 0 48 32"><text x="0" y="24" fontSize="24">🟧</text></svg>,
    DEFAULT: <svg className="h-6 w-8" viewBox="0 0 48 32"><rect width="48" height="32" rx="6" fill="#eee" /></svg>,
};

function getCardType(cardNumber: string): string {
    const n = cardNumber.replace(/\s/g, "");
    if (/^4/.test(n)) return "VISA";
    if (/^5[1-5]/.test(n)) return "MASTERCARD";
    if (/^3[47]/.test(n)) return "AMEX";
    if (/^6(?:011|5)/.test(n)) return "DISCOVER";
    return "DEFAULT";
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
    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardHolderName: "",
        cardExpiryMonth: "",
        cardExpiryYear: "",
        cardCvv: ""
    });
    const [walletType, setWalletType] = useState<string>(WALLET_TYPES[0].key);

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
            // Prepare payment data based on payment method
            const paymentData: {
                amount: string;
                description: string;
                accountNo?: string;
                cardInfo?: {
                    cardNumber: string;
                    cardHolderName: string;
                    cardExpiryMonth: string;
                    cardExpiryYear: string;
                    cardCvv: string;
                };
                walletType?: string;
            } = {
                amount: formData.amount,
                description: formData.description
            };

            if (paymentMethod === "waafipay") {
                paymentData.accountNo = formData.accountNo;
                paymentData.walletType = walletType;
            } else if (paymentMethod === "card") {
                paymentData.cardInfo = cardData;
            }

            // Process the payment
            const paymentResponse = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            const paymentResult = await paymentResponse.json();

            if (!paymentResponse.ok) {
                throw new Error(paymentResult.message || "Bixinta waa guuldareysatay");
            }

            if (paymentResult.success) {
                // Check if this is an HPP redirect response
                if (paymentResult.hppUrl) {
                    // Redirect to WaafiPay hosted payment page
                    window.location.href = paymentResult.hppUrl;
                    return;
                }

                // If payment is successful, update the user's premium status
                const successResponse = await fetch("/api/payment/success", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transactionId: paymentResult.data.params.transactionId,
                        referenceId: paymentResult.data.params.referenceId,
                        state: paymentResult.data.params.state,
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
                // Handle specific error types
                if (paymentResult.error === "HPP_NOT_AUTHORIZED") {
                    setError("Kaarka bixinta ma suurtagelin karto hadda. Fadlan isticmaal WaafiPay mobile wallet.");
                } else {
                    setError(translateError(paymentResult.message || "Bixinta waa guuldareysatay"));
                }
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

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCardSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCardData((prev) => ({ ...prev, [name]: value }));
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

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
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
                                                disabled={method.key === "bank" || method.key === "points"}
                                            >
                                                {method.icon}
                                                <span className="text-xs mt-1 font-semibold">{method.label}</span>
                                                {(method.key === "bank" || method.key === "points") && (
                                                    <span className="text-[10px] text-gray-400">Dhowaan</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* WaafiPay Form */}
                                    {paymentMethod === "waafipay" && (
                                        <div className="space-y-4">
                                            <div className="flex gap-2 mb-2">
                                                {WALLET_TYPES.map((w) => (
                                                    <Button
                                                        key={w.key}
                                                        type="button"
                                                        variant={walletType === w.key ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setWalletType(w.key)}
                                                        disabled={loading}
                                                    >
                                                        {w.label}
                                                    </Button>
                                                ))}
                                            </div>
                                            <Input
                                                id="accountNo"
                                                name="accountNo"
                                                value={formData.accountNo}
                                                onChange={handleInputChange}
                                                placeholder="Lambarka (e.g. 2526xxxxxxx)"
                                                required
                                                pattern="[0-9]+"
                                                title="Fadlan geli lambarka saxda ah"
                                                className="w-full h-12 text-base bg-white rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Card Payment Form */}
                                    {paymentMethod === "card" && (
                                        <div className="space-y-4">
                                            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                                                <AlertDescription>
                                                    Kaarka bixinta ma suurtagelin karto hadda. Fadlan isticmaal WaafiPay mobile wallet.
                                                </AlertDescription>
                                            </Alert>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="cardNumber"
                                                    name="cardNumber"
                                                    value={cardData.cardNumber}
                                                    onChange={(e) => {
                                                        const formatted = formatCardNumber(e.target.value);
                                                        setCardData(prev => ({ ...prev, cardNumber: formatted }));
                                                    }}
                                                    placeholder="Lambarka kaarka (1234 5678 9012 3456)"
                                                    required
                                                    maxLength={19}
                                                    className="w-full h-12 text-base bg-white rounded-lg"
                                                />
                                                <span>{CARD_ICONS[getCardType(cardData.cardNumber)]}</span>
                                            </div>
                                            <Input
                                                id="cardHolderName"
                                                name="cardHolderName"
                                                value={cardData.cardHolderName}
                                                onChange={handleCardInputChange}
                                                placeholder="Magaca kaarka (JOHN DOE)"
                                                required
                                                className="w-full h-12 text-base bg-white rounded-lg"
                                            />
                                            <div className="grid grid-cols-3 gap-4">
                                                <select
                                                    id="cardExpiryMonth"
                                                    name="cardExpiryMonth"
                                                    value={cardData.cardExpiryMonth}
                                                    onChange={handleCardSelectChange}
                                                    required
                                                    className="w-full h-12 text-base bg-white rounded-lg"
                                                >
                                                    <option value="">Bil</option>
                                                    {[...Array(12)].map((_, i) => (
                                                        <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    id="cardExpiryYear"
                                                    name="cardExpiryYear"
                                                    value={cardData.cardExpiryYear}
                                                    onChange={handleCardSelectChange}
                                                    required
                                                    className="w-full h-12 text-base bg-white rounded-lg"
                                                >
                                                    <option value="">Sanad</option>
                                                    {Array.from({ length: 15 }, (_, i) => {
                                                        const year = new Date().getFullYear() % 100 + i;
                                                        return <option key={year} value={String(year).padStart(2, "0")}>{String(year).padStart(2, "0")}</option>;
                                                    })}
                                                </select>
                                                <Input
                                                    id="cardCvv"
                                                    name="cardCvv"
                                                    value={cardData.cardCvv}
                                                    onChange={handleCardInputChange}
                                                    placeholder="CVV"
                                                    required
                                                    maxLength={4}
                                                    pattern="[0-9]*"
                                                    className="w-full h-12 text-base bg-white rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
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