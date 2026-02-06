"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ParentalConsentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userAge: number;
    userEmail: string;
    onConsentSent?: () => void;
}

export function ParentalConsentDialog({
    open,
    onOpenChange,
    userAge,
    userEmail,
    onConsentSent,
}: ParentalConsentDialogProps) {
    const [parentEmail, setParentEmail] = useState("");
    const [parentName, setParentName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // TODO: Implement API call to send parental consent email
            const response = await fetch("/api/auth/parental-consent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    parentEmail,
                    parentName,
                    userEmail,
                    userAge,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send consent request");
            }

            setSuccess(true);
            onConsentSent?.();

            // Close dialog after 3 seconds
            setTimeout(() => {
                onOpenChange(false);
                setSuccess(false);
                setParentEmail("");
                setParentName("");
            }, 3000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to send consent request. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Ogolaanshaha Waalidiinta
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Sababtoo ah da'daadu waa ka yar tahay 13 sano, waxaan u baahanahay
                        ogolaansho waalidiinta si aad u isticmaasho adeeggan.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8">
                        <Alert className="border-emerald-200 bg-emerald-50">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <AlertDescription className="text-emerald-800 ml-2">
                                <strong>Guul!</strong> Waxaan u dirnay email waalidkaaga. Fadlan
                                ka codsada inay xaqiijiyaan ogolaanshahooda.
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="parentName" className="text-sm font-bold">
                                    Magaca Waalid/Masuul
                                </Label>
                                <Input
                                    id="parentName"
                                    type="text"
                                    placeholder="Geli magaca waalidka"
                                    value={parentName}
                                    onChange={(e) => setParentName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parentEmail" className="text-sm font-bold">
                                    Email-ka Waalid/Masuul
                                </Label>
                                <Input
                                    id="parentEmail"
                                    type="email"
                                    placeholder="waalid@example.com"
                                    value={parentEmail}
                                    onChange={(e) => setParentEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-12"
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                            <p className="font-semibold mb-2">Maxaa dhici doona:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Waxaan u diri doonaa email waalidkaaga</li>
                                <li>Waxay xaqiijin doonaan ogolaanshahooda</li>
                                <li>
                                    Markay xaqiijiyaan, akoonkaaga ayaa la hawlgelin doonaa
                                </li>
                            </ol>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Ka noqo
                            </Button>
                            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Diraya...
                                    </>
                                ) : (
                                    "Dir Codsiga"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
