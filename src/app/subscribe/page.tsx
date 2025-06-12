"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function SubscribePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        accountNo: '',
        amount: '9.99', // Default subscription amount
        description: 'Premium Subscription'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountNo: formData.accountNo,
                    amount: formData.amount,
                    description: formData.description
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Payment processing failed');
            }

            if (data.success) {
                // Redirect to success page or dashboard
                router.push('/dashboard');
            } else {
                setError(data.message || 'Payment processing failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container max-w-md mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Subscribe to Premium</CardTitle>
                    <CardDescription>
                        Enter your WaafiPay account number to subscribe to premium features
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
                            <Label htmlFor="accountNo">WaafiPay Account Number</Label>
                            <Input
                                id="accountNo"
                                name="accountNo"
                                value={formData.accountNo}
                                onChange={handleInputChange}
                                placeholder="Enter your WaafiPay account number"
                                required
                                pattern="[0-9]+"
                                title="Please enter a valid account number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (USD)</Label>
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
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Subscribe Now'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 