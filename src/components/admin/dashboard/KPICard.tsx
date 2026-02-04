import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;
    trend?: "up" | "down" | "neutral";
    icon?: React.ReactNode;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export default function KPICard({
    title,
    value,
    change,
    trend = "neutral",
    icon,
    prefix = "",
    suffix = "",
    decimals = 0,
}: KPICardProps) {
    const formatValue = (val: string | number): string => {
        if (typeof val === "string") return val;
        return val.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    const getTrendColor = () => {
        switch (trend) {
            case "up":
                return "text-green-600";
            case "down":
                return "text-red-600";
            default:
                return "text-gray-500";
        }
    };

    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {title}
                </h3>
                {icon && (
                    <div className="p-2.5 bg-blue-50/50 rounded-xl text-blue-600">
                        {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-black text-gray-900 mb-1.5 tracking-tight">
                        {prefix}
                        {formatValue(value)}
                        {suffix}
                    </div>

                    {change !== undefined && (
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold ${getTrendColor()}`}>
                            <TrendIcon className="w-3.5 h-3.5" />
                            <span className="uppercase tracking-wider">
                                {Math.abs(change)}% {trend === "up" ? "korodh" : trend === "down" ? "hoos u dhac" : "sidii hore"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
