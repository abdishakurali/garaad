"use client";

import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { inter } from "@/lib/fonts";

export default function RootLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="so">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
} 