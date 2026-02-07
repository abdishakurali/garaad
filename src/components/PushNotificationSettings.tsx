"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, AlertCircle, CheckCircle2 } from "lucide-react";
import pushNotificationService from "@/services/pushNotifications";
import { useAuthStore } from "@/store/useAuthStore";

export default function PushNotificationSettings() {
    const { user } = useAuthStore();
    const isAuthenticated = !!user;
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Check if push notifications are supported
        const supported = pushNotificationService.isPushSupported();
        setIsSupported(supported);

        if (supported) {
            // Check current permission
            const currentPermission = pushNotificationService.getNotificationPermission();
            setPermission(currentPermission);

            // Check if already subscribed
            pushNotificationService.isSubscribedToPush().then(setIsSubscribed);
        }
    }, [isAuthenticated]);

    const handleToggle = async (enabled: boolean) => {
        setIsLoading(true);
        setError(null);

        try {
            if (enabled) {
                // Subscribe to push notifications
                const success = await pushNotificationService.subscribeToPushNotifications();
                if (success) {
                    setIsSubscribed(true);
                    setPermission("granted");
                } else {
                    setError("Waxaa dhacday cillad. Fadlan dib u day.");
                    setIsSubscribed(false);
                }
            } else {
                // Unsubscribe from push notifications
                const success = await pushNotificationService.unsubscribeFromPushNotifications();
                if (success) {
                    setIsSubscribed(false);
                } else {
                    setError("Waxaa dhacday cillad. Fadlan dib u day.");
                }
            }
        } catch (err) {
            console.error("Error toggling push notifications:", err);
            setError("Waxaa dhacday cillad. Fadlan dib u day.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (!isSupported) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BellOff className="h-5 w-5" />
                        Ogeysiisyada Push
                    </CardTitle>
                    <CardDescription>
                        Browserkaaga ma taageero ogeysiisyada push
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                            <p>
                                Si aad u hesho ogeysiisyada push, isticmaal browser casri ah sida Chrome, Firefox, ama Edge.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Ogeysiisyada Push
                </CardTitle>
                <CardDescription>
                    Hel ogeysiis marka qof kale uu qoro ama ku jawaabo
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="font-medium">Ogeysiisyada Push</div>
                        <div className="text-sm text-muted-foreground">
                            Hel ogeysiisyo xitaa markaad app-ka xirayso
                        </div>
                    </div>
                    <Switch
                        checked={isSubscribed}
                        onCheckedChange={handleToggle}
                        disabled={isLoading || permission === "denied"}
                    />
                </div>

                {permission === "denied" && (
                    <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-destructive mb-1">
                                Ogeysiisyada waa la diidey
                            </p>
                            <p className="text-muted-foreground">
                                Si aad u oggolaato ogeysiisyada, fur settings-ka browserkaaga oo u oggolow garaad.org inuu ku soo diro ogeysiisyo.
                            </p>
                        </div>
                    </div>
                )}

                {isSubscribed && permission === "granted" && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                                Ogeysiisyada waa la furay
                            </p>
                            <p className="text-green-700 dark:text-green-300">
                                Waxaad heli doontaa ogeysiisyo marka qof kale uu qoro ama ku jawaabo.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-destructive">
                            {error}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Macluumaad</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Ogeysiisyada push waxay ku shaqeeyaan xitaa markaad app-ka xirayso</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Waxaad heli doontaa ogeysiis marka qof kale uu qoro, ku jawaabo, ama faalceliyo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Waxaad xiri kartaa ogeysiisyada waqti kasta</span>
                        </li>
                    </ul>
                </div>

                {permission === "default" && !isSubscribed && (
                    <Button
                        onClick={() => handleToggle(true)}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Waa la furayaa..." : "Fur Ogeysiisyada"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
