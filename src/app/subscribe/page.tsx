"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreditCard, Lock, Building2, Coins, Phone } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { waafipayService } from "@/services/waafipay";
import { useToast } from "@/hooks/use-toast";

export default function SubscribePage() {
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "points" | "waafipay">("waafipay");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handlePayment = async () => {
        if (paymentMethod !== "waafipay") {
            // Handle other payment methods
            return;
        }

        if (!phoneNumber) {
            toast({
                variant: "destructive",
                title: "Khalad",
                description: "Fadlan geli lambarka taleefanka",
            });
            return;
        }

        setIsProcessing(true);
        try {
            const amount = selectedPlan === "annual" ? 16 : 20;
            const response = await waafipayService.createPayment({
                accountNumber: phoneNumber,
                amount: amount,
                description: `Garaad Plus Subscription - ${selectedPlan === "annual" ? "Annual" : "Monthly"} Plan`,
                referenceId: `SUB-${Date.now()}`,
            });

            if (response.responseCode === "2001") {
                toast({
                    title: "Waad ku guuleysatay",
                    description: "Waad ku mahadsantahay inaad nala biirsay Garaad Plus",
                });
                // Redirect to success page or dashboard
            } else {
                throw new Error(response.responseMsg);
            }
        } catch (error: Error | unknown) {
            toast({
                variant: "destructive",
                title: "Khalad",
                description: error instanceof Error ? error.message : "Khalad ayaa dhacay, fadlan isku day mar kale",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
                <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-2xl font-semibold tracking-tight">
                            Garaad
                        </Link>
                    </div>
                </div>
            </header>

            <main className="min-h-screen bg-white pt-24 pb-16">
                <div className="max-w-[1200px] mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-semibold mb-2">Ku biir Garaad Plus</h1>
                        <p className="text-gray-600 text-lg">
                            Hel casharrada oo dhan, faylasha, iyo adeegyada dheeraadka ah oo xadidnayn la'aan ah.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Payment Form */}
                        <div className="flex-1">
                            {/* Billing Information */}
                            <div className="mb-8">
                                <h2 className="text-base font-medium text-gray-700 mb-2">Macluumaadka Biilka</h2>
                                <Input
                                    placeholder="Magaca oo buuxa"
                                    className="w-full h-12 text-base bg-white"
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="mb-8">
                                <h2 className="text-base font-medium text-gray-700 mb-4">Habka Lacag Bixinta</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <PaymentOption
                                        icon={<Phone className="w-5 h-5" />}
                                        title="WaafiPay"
                                        selected={paymentMethod === "waafipay"}
                                        onClick={() => setPaymentMethod("waafipay")}
                                    />
                                    <PaymentOption
                                        icon={<CreditCard className="w-5 h-5" />}
                                        title="Kaarka"
                                        selected={paymentMethod === "card"}
                                        onClick={() => setPaymentMethod("card")}
                                    />
                                    <PaymentOption
                                        icon={<Building2 className="w-5 h-5" />}
                                        title="Bangiga"
                                        selected={paymentMethod === "bank"}
                                        onClick={() => setPaymentMethod("bank")}
                                    />
                                    <PaymentOption
                                        icon={<Coins className="w-5 h-5" />}
                                        title="Dhibcaha"
                                        selected={paymentMethod === "points"}
                                        onClick={() => setPaymentMethod("points")}
                                    />
                                </div>
                            </div>

                            {/* WaafiPay Details */}
                            {paymentMethod === "waafipay" && (
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Lambarka Taleefanka (252615...)"
                                        className="w-full h-12 text-base bg-white"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500">
                                        Waxaa laguu soo diri doonaa fariin xaqiijin ah taleefankaaga
                                    </p>
                                </div>
                            )}

                            {/* Card Details */}
                            {paymentMethod === "card" && (
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Lambarka Kaarka"
                                        className="w-full h-12 text-base bg-white"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="MM/YY"
                                            className="w-full h-12 text-base bg-white"
                                        />
                                        <Input
                                            placeholder="CVC"
                                            className="w-full h-12 text-base bg-white"
                                        />
                                    </div>
                                    <Input
                                        placeholder="ZIP/Postal"
                                        className="w-full h-12 text-base bg-white"
                                    />
                                </div>
                            )}

                            {/* Bank Transfer Details */}
                            {paymentMethod === "bank" && (
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Magaca Bangiga"
                                        className="w-full h-12 text-base bg-white"
                                    />
                                    <Input
                                        placeholder="Lambarka Koontada"
                                        className="w-full h-12 text-base bg-white"
                                    />
                                    <Input
                                        placeholder="Routing Number"
                                        className="w-full h-12 text-base bg-white"
                                    />
                                </div>
                            )}

                            {/* Points Details */}
                            {paymentMethod === "points" && (
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-purple-700">
                                        Waxaad haysataa 1,000 dhibcood oo la isticmaali karo
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 bg-gray-50 hover:bg-gray-100"
                                >
                                    Ka noqo
                                </Button>
                                <Button
                                    className="flex-1 h-12 bg-purple-500 hover:bg-purple-600 text-white"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Waa la howlgalayaa..." : "Bixi"}
                                </Button>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                Markaad bixineyso macluumaadka kaarka, waxaad ogolaanaysaa in mustaqbalka lagaa jari doono
                                si waafaqsan shuruudaha.
                            </p>
                        </div>

                        {/* Right Column - Plan Selection */}
                        <div className="w-full md:w-[400px] bg-gray-50 p-8 rounded-xl">
                            <h2 className="text-xl font-semibold mb-6">Qorshaha Bilowga ah</h2>

                            <RadioGroup
                                defaultValue="annual"
                                className="space-y-3"
                                value={selectedPlan}
                                onValueChange={(value: "monthly" | "annual") => setSelectedPlan(value)}
                            >
                                <div className={cn(
                                    "border rounded-xl p-4 transition-all bg-white",
                                    selectedPlan === "monthly" ? "border-gray-200" : "border-transparent"
                                )}>
                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="monthly" id="monthly" />
                                        <Label htmlFor="monthly" className="flex-1">
                                            <div className="font-medium">Bixi Bil kasta</div>
                                            <div className="text-sm text-gray-500">$20 / Bil kasta / Xubin</div>
                                        </Label>
                                    </div>
                                </div>

                                <div className={cn(
                                    "border rounded-xl p-4 transition-all",
                                    selectedPlan === "annual" ? "border-purple-200 bg-purple-50" : "border-transparent bg-white"
                                )}>
                                    <div className="flex items-center space-x-4">
                                        <RadioGroupItem value="annual" id="annual" />
                                        <Label htmlFor="annual" className="flex-1">
                                            <div className="font-medium">Bixi Sanadkiiba</div>
                                            <div className="text-sm text-gray-500">$16 / Bil kasta / Xubin</div>
                                        </Label>
                                        <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                                            Keydi 15%
                                        </span>
                                    </div>
                                </div>
                            </RadioGroup>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-medium">Wadarta</span>
                                    <span className="font-medium text-xl">
                                        ${selectedPlan === "annual" ? "16" : "20"} / Bil kasta
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Lock className="w-4 h-4" />
                                    <span>
                                        Waa la hubin doonaa inay ammaan tahay, dhammaan macaamilka waxaa lagu ilaalinayaa heerka ugu sarreeya ee amniga.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function PaymentOption({
    icon,
    title,
    selected,
    onClick
}: {
    icon: React.ReactNode;
    title: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-4 rounded-xl border text-center transition-all hover:border-purple-200",
                selected ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                selected ? "bg-purple-100" : "bg-gray-50"
            )}>
                {icon}
            </div>
            <span className="text-sm font-medium">{title}</span>
        </button>
    );
} 