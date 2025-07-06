"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, CreditCard, Globe, MapPin } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, selectCurrentUser } from '@/store/features/authSlice';
import AuthService from "@/services/auth";
import StripeService from "@/services/stripe";
import LocationService, { type LocationData } from "@/services/location";
import Logo from "@/components/ui/Logo";
import OrderService from "@/services/orders";
import { useWaafiPayConfig } from "@/config/waafipay";

const PAYMENT_METHODS = [
    { key: "waafipay", label: "WaafiPay", icon: <Phone className="w-5 h-5" /> },
    { key: "stripe", label: "Kaarka", icon: <CreditCard className="w-5 h-5" /> },
];

// Price configuration based on location
const PRICES = {
    SOMALIA: "19",
    INTERNATIONAL: "49"
};

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

export default function SubscribePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const { getWalletTypes } = useWaafiPayConfig();
    const WALLET_TYPES = getWalletTypes();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("waafipay");
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState(PRICES.INTERNATIONAL);
    const [formData, setFormData] = useState({
        accountNo: "",
        amount: PRICES.INTERNATIONAL,
        description: "Isdiiwaangeli Premium"
    });
    const [walletType, setWalletType] = useState<string>(WALLET_TYPES[0]?.key || "MWALLET_EVC");



    // Check if user is already premium and redirect
    useEffect(() => {
        const authService = AuthService.getInstance();
        if (authService.isPremium()) {
            router.push("/courses");
        }
    }, [router]);

    // Detect user location and set price and recommended payment method
    useEffect(() => {
        const detectLocation = async () => {
            try {
                const locationService = LocationService.getInstance();
                const location = await locationService.getUserLocation();

                if (location) {
                    setLocationData(location);
                    const recommendedMethod = locationService.getRecommendedPaymentMethod(location.countryCode);
                    setPaymentMethod(recommendedMethod);

                    // Set price based on location
                    const price = location.countryCode === 'SO' ? PRICES.SOMALIA : PRICES.INTERNATIONAL;
                    setCurrentPrice(price);
                    setFormData(prev => ({
                        ...prev,
                        amount: price
                    }));
                }
            } catch (error) {
                console.error('Error detecting location:', error);
                // Default to international price if location detection fails
                setCurrentPrice(PRICES.INTERNATIONAL);
            } finally {
                setLocationLoading(false);
            }
        };

        detectLocation();
    }, []);

    // Create plan options based on current price
    const PLAN_OPTIONS = [
        {
            key: "monthly",
            label: "Bille",
            price: currentPrice,
            note: `$${currentPrice} / Bil kasta / Xubin`
        },
    ];

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
            const orderService = OrderService.getInstance();

            if (paymentMethod === "stripe") {
                // First create order for Stripe payment
                const orderRequest = {
                    subscription_type: "monthly" as const,
                    payment_method: "stripe" as const,
                    currency: "USD" as const,
                };

                const orderResponse = await orderService.createSubscriptionOrder(orderRequest);

                if (!orderResponse.success) {
                    throw new Error(orderResponse.message || "Failed to create order");
                }

                // Handle Stripe payment with order reference
                const stripeService = StripeService.getInstance();
                const countryCode = locationData?.countryCode || 'INTERNATIONAL';
                await stripeService.createCheckoutSession('monthly', countryCode);
            } else if (paymentMethod === "waafipay") {
                // First create order for WaafiPay payment
                const orderRequest = {
                    subscription_type: "monthly" as const,
                    payment_method: "waafi" as const,
                    currency: locationData?.countryCode === 'SO' ? "USD" as const : "USD" as const,
                };

                const orderResponse = await orderService.createSubscriptionOrder(orderRequest);

                if (!orderResponse.success) {
                    throw new Error(orderResponse.message || "Ku guuldaraystay in la sameeyo dalashada");
                }

                const order = orderResponse.data;

                // Handle WaafiPay payment with order reference
                const selectedWallet = WALLET_TYPES.find(w => w.key === walletType);
                const defaultPrefix = selectedWallet?.prefixes[0] || "+252";
                const prefixNumbers = defaultPrefix.replace(/[^\d]/g, '');
                const fullPhoneNumber = prefixNumbers + (formData.accountNo || "");

                const paymentData = {
                    amount: parseFloat(order.total_amount),
                    description: order.description,
                    accountNo: fullPhoneNumber,
                    walletType: walletType,
                    // Add order reference for tracking
                    referenceId: order.order_number,
                    invoiceId: `INV-${order.id}`,
                };

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
                            orderId: order.id,
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
                        router.push("/courses?order=" + order.id);
                    } else {
                        setError(translateError(successData.message || "Ku guuldaraystay in la cusboonaysiiyo xaaladda premium"));
                    }
                } else {
                    // Handle specific error types
                    if (paymentResult.error === "HPP_NOT_AUTHORIZED") {
                        setError("Kaarka bixinta ma suurtagelin karto hadda. Fadlan isticmaal WaafiPay mobile wallet.");
                    } else {
                        setError(translateError(paymentResult.message || "Bixinta waa guuldareysatay"));
                    }
                }
            }
        } catch (err) {
            setError(translateError(err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    // Handle wallet type change and auto-prefix
    const handleWalletTypeChange = (newWalletType: string) => {
        setWalletType(newWalletType);
        // Reset account number when changing wallet type
        setFormData(prev => ({
            ...prev,
            accountNo: ""
        }));
    };

    // Handle account number input with proper prefix handling
    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        const selectedWallet = WALLET_TYPES.find(w => w.key === walletType);
        if (!selectedWallet) return;

        const defaultPrefix = selectedWallet.prefixes[0]; // e.g., "+25261"
        const prefixNumbers = defaultPrefix.replace(/[^\d]/g, ''); // e.g., "25261"

        // If the input is empty or just contains the prefix, clear the stored value
        if (!value || value === defaultPrefix) {
            setFormData(prev => ({
                ...prev,
                accountNo: ""
            }));
            return;
        }

        // If value starts with the full prefix (+25261), extract only the additional numbers
        if (value.startsWith(defaultPrefix)) {
            const additionalNumbers = value.slice(defaultPrefix.length).replace(/[^\d]/g, '');
            // Store only the additional numbers (the part after prefix)
            // Limit to 7 additional digits
            setFormData(prev => ({
                ...prev,
                accountNo: additionalNumbers.slice(0, 7)
            }));
            return;
        }

        // If somehow the prefix was removed, try to extract meaningful digits
        const allDigits = value.replace(/[^\d]/g, '');
        if (allDigits.startsWith(prefixNumbers)) {
            // Extract additional numbers after the prefix
            const additionalNumbers = allDigits.slice(prefixNumbers.length);
            setFormData(prev => ({
                ...prev,
                accountNo: additionalNumbers.slice(0, 7)
            }));
        } else {
            // Store the digits as additional numbers (assume user is typing without prefix)
            setFormData(prev => ({
                ...prev,
                accountNo: allDigits.slice(0, 7)
            }));
        }
    };

    const getLocationAlert = () => {
        if (locationLoading) {
            return (
                <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                        <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                        La helaya meesha aad ku jirto...
                    </AlertDescription>
                </Alert>
            );
        }

        if (!locationData) {
            return (
                <Alert className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800">
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                        Meesha aad ku jirto lama heli karin. Fadlan dooro habka bixinta aad rabto.
                    </AlertDescription>
                </Alert>
            );
        }

        const locationService = LocationService.getInstance();
        const recommendedMethod = locationService.getRecommendedPaymentMethod(locationData.countryCode);
        const countryName = locationService.getCountryDisplayName(locationData.countryCode);
        const description = locationService.getPaymentMethodDescription(recommendedMethod, countryName);

        // Determine region for better context
        const getRegionInfo = (countryCode: string) => {
            const upperCode = countryCode.toUpperCase();
            if (upperCode === 'SO') return 'Afrika Bari';
            if (['US', 'CA'].includes(upperCode)) return 'Ameerika Waqooyi';
            if (['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'IE', 'PT', 'GR', 'CY', 'MT', 'LU'].includes(upperCode)) return 'Yurub';
            if (['AU', 'NZ', 'JP', 'KR', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'IN', 'HK', 'TW'].includes(upperCode)) return 'Aasiya Pasifik';
            if (['KE', 'NG', 'ZA', 'EG', 'MA', 'TN', 'DZ', 'ET', 'UG', 'TZ', 'GH', 'CI', 'SN', 'ML', 'BF', 'NE', 'TD', 'SD', 'LY', 'CM', 'CF', 'CG', 'CD', 'AO', 'ZM', 'ZW', 'BW', 'NA', 'SZ', 'LS', 'MG', 'MU', 'SC', 'DJ', 'ER', 'SS', 'RW', 'BI', 'MW', 'MZ'].includes(upperCode)) return 'Afrika';
            return 'Kale';
        };

        const region = getRegionInfo(locationData.countryCode);

        return (
            <Alert className={`mb-6 ${recommendedMethod === 'stripe'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                    <div className="flex items-start justify-between">
                        <div>
                            <strong>Waxaad ku sugantahay:</strong> {countryName}
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded ml-2">{region}</span>
                            {locationData.city && (
                                <span className="text-sm text-gray-600 ml-2">• {locationData.city}</span>
                            )}
                            <br />
                            <span className="text-sm">{description}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setLocationData(null);
                                setLocationLoading(true);
                                // Re-detect location
                                const detectLocation = async () => {
                                    try {
                                        const locationService = LocationService.getInstance();
                                        const location = await locationService.getUserLocation();
                                        if (location) {
                                            setLocationData(location);
                                            const recommendedMethod = locationService.getRecommendedPaymentMethod(location.countryCode);
                                            setPaymentMethod(recommendedMethod);
                                        }
                                    } catch (error) {
                                        console.error('Error detecting location:', error);
                                    } finally {
                                        setLocationLoading(false);
                                    }
                                };
                                detectLocation();
                            }}
                            className="ml-4 text-xs"
                        >
                            Dib u hel
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-2">
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-24">
                {/* Left: Payment Form */}
                <div className="flex-1 min-w-0">
                    <Card className="p-0 overflow-hidden shadow-2xl border border-gray-100 bg-white rounded-3xl">
                        <div className="p-8 md:p-14">
                            <div className="flex flex-col items-center mb-8">
                                <Logo
                                    width={180}
                                    height={54}
                                    className="h-12 w-auto sm:h-14 md:h-16 max-w-[140px] sm:max-w-[160px] md:max-w-[180px] mb-4 drop-shadow-md rounded-xl"
                                    priority={true}
                                    loading="eager"
                                    sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 180px"
                                />
                                <h1 className="text-4xl font-extrabold text-purple-700 mb-2 text-center">Kor u qaad Plus</h1>
                                <p className="text-gray-500 text-lg text-center">Ku hel blocks, faylal, iyo adeegyo aan xadidnayn.</p>
                            </div>

                            {/* Location Alert */}
                            {getLocationAlert()}

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
                                        {PAYMENT_METHODS.map((method) => {
                                            const locationService = LocationService.getInstance();
                                            const isRecommended = locationData &&
                                                locationService.getRecommendedPaymentMethod(locationData.countryCode) === method.key;

                                            return (
                                                <button
                                                    type="button"
                                                    key={method.key}
                                                    className={`flex-1 min-w-[110px] flex flex-col items-center justify-center border rounded-xl p-4 transition-all text-base font-medium shadow-sm relative ${paymentMethod === method.key
                                                        ? "border-purple-500 bg-purple-50"
                                                        : "border-gray-200 bg-white"
                                                        }`}
                                                    onClick={() => setPaymentMethod(method.key)}
                                                    disabled={method.key === "bank" || method.key === "points"}
                                                >
                                                    {isRecommended && (
                                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                            Lagu taliyay
                                                        </div>
                                                    )}
                                                    {method.icon}
                                                    <span className="text-xs mt-1 font-semibold">{method.label}</span>
                                                    {(method.key === "bank" || method.key === "points") && (
                                                        <span className="text-[10px] text-gray-400">Dhowaan</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* WaafiPay Form */}
                                    {paymentMethod === "waafipay" && (
                                        <div className="space-y-4">
                                            <div className="flex gap-2 mb-2 flex-wrap">
                                                {WALLET_TYPES.map((w) => (
                                                    <Button
                                                        key={w.key}
                                                        type="button"
                                                        variant={walletType === w.key ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleWalletTypeChange(w.key)}
                                                        disabled={loading}
                                                    >
                                                        {w.label}
                                                    </Button>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium">
                                                    Lambarka Mobileka
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type="tel"
                                                        value={(() => {
                                                            const selectedWallet = WALLET_TYPES.find(w => w.key === walletType);
                                                            const defaultPrefix = selectedWallet?.prefixes[0] || "+252";

                                                            // Always show prefix + additional numbers
                                                            // formData.accountNo now only contains the additional numbers
                                                            return defaultPrefix + (formData.accountNo || "");
                                                        })()}
                                                        onChange={handleAccountNumberChange}
                                                        placeholder={WALLET_TYPES.find(w => w.key === walletType)?.placeholder}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Tusaale: {WALLET_TYPES.find(w => w.key === walletType)?.placeholder}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stripe Card Payment Form */}
                                    {paymentMethod === "stripe" && (
                                        <div className="space-y-4">
                                            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                                                <AlertDescription>
                                                    Waxaad isticmaali doontaa Stripe si aad u bixiso kaarka. Waxay ka dhigaysaa mid ammaan ah oo la hubo.
                                                </AlertDescription>
                                            </Alert>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    Marka aad riixdo &ldquo;Isdiiwaangeli&rdquo;, waxaad u dhici doontaa bogga Stripe si aad u geliso faahfaahinta kaarkaaga.
                                                </p>
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
                                    <div
                                        key={option.key}
                                        className="flex items-center justify-between w-full border rounded-xl p-4 mb-2 transition-all text-base font-medium shadow-sm border-purple-500 bg-purple-50"
                                    >
                                        <span className="font-semibold">{option.label}</span>
                                        <span className="text-sm text-gray-500">{option.note}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Wadarta</span>
                                <span className="font-bold text-2xl text-purple-700">${formData.amount} / Bil</span>
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