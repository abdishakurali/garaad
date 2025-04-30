import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SomaliTextDisplayProps {
    text: string;
    text1: string;
}

export function SomaliTextDisplay({ text, text1 }: SomaliTextDisplayProps) {
    return (
        <Card className="w-full max-w-2xl mx-auto p-6">
            <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-800">
                    {text}
                </p>
                <p className="text-lg leading-relaxed text-gray-800">
                    {text1}
                </p>
            </CardContent>
        </Card>
    );
} 