"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Phone } from "lucide-react";

interface PaymentTestProps {
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
}

export function PaymentTest({ onSuccess, onError }: PaymentTestProps) {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"waafipay" | "card">("waafipay");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // WaafiPay form data
    const [waafiData, setWaafiData] = useState({
        accountNo: "",
        amount: "10",
        description: "Test Payment"
    });

    // Card form data
    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardHolderName: "",
        cardExpiryMonth: "",
        cardExpiryYear: "",
        cardCvv: ""
    });

    const handleWaafiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWaafiData(prev => ({ ...prev, [name]: value }));
    };

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const paymentData: any = {
                amount: parseFloat(paymentMethod === "waafipay" ? waafiData.amount : "10"),
                description: paymentMethod === "waafipay" ? waafiData.description : "Test Card Payment"
            };

            if (paymentMethod === "waafipay") {
                paymentData.accountNo = waafiData.accountNo;
            } else if (paymentMethod === "card") {
                paymentData.cardInfo = cardData;
            }

            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Bixinta waa guuldareysatay");
            }

            if (result.success) {
                const successMessage = `Payment successful! Transaction ID: ${result.data.params.transactionId}`;
                setSuccess(successMessage);
                onSuccess?.(result.data);
            } else {
                throw new Error(result.message || "Bixinta waa guuldareysatay");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Bixinta waa guuldareysatay";
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Payment Test</h2>

            {/* Payment Method Selection */}
            <div className="flex gap-2 mb-4">
                <Button
                    type="button"
                    variant={paymentMethod === "waafipay" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentMethod("waafipay")}
                    disabled={loading}
                >
                    <Phone className="w-4 h-4 mr-2" />
                    WaafiPay
                </Button>
                <Button
                    type="button"
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentMethod("card")}
                    disabled={loading}
                >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {paymentMethod === "waafipay" ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <Input
                                name="accountNo"
                                value={waafiData.accountNo}
                                onChange={handleWaafiInputChange}
                                placeholder="Lambarka Telefoonka"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <Input
                                name="amount"
                                type="number"
                                value={waafiData.amount}
                                onChange={handleWaafiInputChange}
                                placeholder="Qiimaha (USD)"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Input
                                name="description"
                                value={waafiData.description}
                                onChange={handleWaafiInputChange}
                                placeholder="Sharaxaada Bixinta"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Card Number</label>
                            <Input
                                name="cardNumber"
                                value={cardData.cardNumber}
                                onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value);
                                    setCardData(prev => ({ ...prev, cardNumber: formatted }));
                                }}
                                placeholder="1234 5678 9012 3456"
                                required
                                maxLength={19}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                            <Input
                                name="cardHolderName"
                                value={cardData.cardHolderName}
                                onChange={handleCardInputChange}
                                placeholder="MAGACA HAYAHA KAARKA"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Month</label>
                                <Input
                                    name="cardExpiryMonth"
                                    value={cardData.cardExpiryMonth}
                                    onChange={handleCardInputChange}
                                    placeholder="12"
                                    required
                                    maxLength={2}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Year</label>
                                <Input
                                    name="cardExpiryYear"
                                    value={cardData.cardExpiryYear}
                                    onChange={handleCardInputChange}
                                    placeholder="25"
                                    required
                                    maxLength={2}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">CVV</label>
                                <Input
                                    name="cardCvv"
                                    value={cardData.cardCvv}
                                    onChange={handleCardInputChange}
                                    placeholder="123"
                                    required
                                    maxLength={4}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Test Payment"
                    )}
                </Button>
            </form>
        </Card>
    );
} 