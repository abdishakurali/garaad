"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, selectAuthError, selectIsLoading } from "@/store/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import type { AppDispatch } from "@/store";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector(selectAuthError);
    const isLoading = useSelector(selectIsLoading);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(login({ email, password })).unwrap();
            if (result) {
                router.push("/dashboard");
            }
        } catch (error) {
            // Error is handled by the Redux store
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Ku soo gal account-kaaga
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <div className="mt-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <div className="mt-2">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full"
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {error}
                                    {error.includes("Account-kan lama helin") && (
                                        <div className="mt-2">
                                            <Link
                                                href="/welcome"
                                                className="text-primary hover:text-primary/90 font-medium"
                                            >
                                                Sameyso account cusub
                                            </Link>
                                        </div>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Sii wad"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Ama
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="/welcome">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                >
                                    Sameyso account cusub
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 