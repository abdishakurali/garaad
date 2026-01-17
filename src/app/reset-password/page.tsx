"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Link-gan ma shaqaynayo ama ma jiro token. Fadlan isku day markale.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setError("Sirtaadu waa inay ka kooban tahay ugu yaraan 8 xaraf.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Labadan sir (passwords) isma waafaqsana.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    new_password: newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Link-gu wuu dhacay ama waa la isticmaalay.");
            }

            setSuccess(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (err: any) {
            console.error("Reset password error:", err);
            setError(err.message || "Cilad ayaa dhacday. Fadlan mar kale isku day.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <Card className="w-full max-w-md shadow-lg border-0 text-center p-6 space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Guul!</CardTitle>
                        <CardDescription className="text-gray-600">
                            Sirtaadii si guul leh ayaa loo bedelay. Hadda waad soo geli kartaa adigoo isticmaalaya sirtaada cusub.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-primary font-medium animate-pulse">
                            Waxaa lagugu celinayaa bogga hore...
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            asChild
                            className="w-full"
                        >
                            <Link href="/">Bogga Hore</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-32 h-12 relative">
                            <Image
                                src="/logo.png"
                                alt="Garaad Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Bedelka Sirta</CardTitle>
                    <CardDescription>Geli sirtaada cusub qaybaha hoose.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="animate-in fade-in">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Khalad</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Sirta Cusub</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10 pr-10 h-11"
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading || !token}
                                    />
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 italic">Ugu yaraan 8 xaraf.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Xaqiiji Sirta</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 h-11"
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading || !token}
                                    />
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !token || !newPassword || !confirmPassword}
                            className="w-full h-11"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {isLoading ? 'Cusbooneysiinaya...' : 'Bedel Sirta'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t p-4">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                    >
                        Ku laabo Bogga Hore
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
