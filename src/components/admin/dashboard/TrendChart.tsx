"use client";

import React from "react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface TrendChartProps {
    data: Array<{ [key: string]: any }>;
    dataKeys: Array<{
        key: string;
        color: string;
        name?: string;
    }>;
    xAxisKey: string;
    type?: "line" | "area" | "bar";
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
}

export default function TrendChart({
    data,
    dataKeys,
    xAxisKey,
    type = "line",
    height = 300,
    showGrid = true,
    showLegend = false,
}: TrendChartProps) {
    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 10, right: 10, left: 0, bottom: 0 },
        };

        const xAxis = (
            <XAxis
                dataKey={xAxisKey}
                stroke="#94a3b8"
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                dy={10}
            />
        );

        const yAxis = (
            <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                    return value.toString();
                }}
            />
        );

        const grid = showGrid ? (
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        ) : null;

        const tooltip = (
            <Tooltip
                contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "16px",
                    padding: "16px",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "#1e293b", fontWeight: 800, marginBottom: "8px", fontSize: "12px" }}
                itemStyle={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
                cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
            />
        );

        const legend = showLegend ? (
            <Legend
                wrapperStyle={{ paddingTop: "24px" }}
                iconType="circle"
                formatter={(value) => <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{value}</span>}
            />
        ) : null;

        switch (type) {
            case "area":
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            {dataKeys.map(({ key, color }) => (
                                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        {grid}
                        {xAxis}
                        {yAxis}
                        {tooltip}
                        {legend}
                        {dataKeys.map(({ key, color, name }) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={color}
                                fill={`url(#gradient-${key})`}
                                strokeWidth={4}
                                name={name || key}
                                animationDuration={1500}
                            />
                        ))}
                    </AreaChart>
                );

            case "bar":
                return (
                    <BarChart {...commonProps}>
                        {grid}
                        {xAxis}
                        {yAxis}
                        {tooltip}
                        {legend}
                        {dataKeys.map(({ key, color, name }) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={color}
                                radius={[6, 6, 0, 0]}
                                name={name || key}
                                barSize={40}
                            />
                        ))}
                    </BarChart>
                );

            case "line":
            default:
                return (
                    <LineChart {...commonProps}>
                        {grid}
                        {xAxis}
                        {yAxis}
                        {tooltip}
                        {legend}
                        {dataKeys.map(({ key, color, name }) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={color}
                                strokeWidth={4}
                                dot={{ fill: color, r: 5, strokeWidth: 3, stroke: "#fff" }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                name={name || key}
                            />
                        ))}
                    </LineChart>
                );
        }
    };

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={height}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
}
