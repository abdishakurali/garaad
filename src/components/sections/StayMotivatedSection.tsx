"use client";

import React, { useState } from 'react';
import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ChevronRight, MousePointer2 } from 'lucide-react';

const TABS = [
    { id: 'math', label: 'Xisaab' },
    { id: 'cs', label: 'IT' },
    { id: 'data', label: 'Xogta' },
    { id: 'science', label: 'Saynis' },
];

const MATH_COURSES = [
    "Fikirka Xisaabta",
    "Sababaynta Saamiyeed",
    "Suurtogalnimada",
    "Aljebra-da Muuqata",
    "Xallinta Isle'egga",
    "Koodaratiig",
    "Kalkulas"
];

export function StayMotivatedSection() {
    const [activeTab, setActiveTab] = useState('math');

    return (
        <section className="py-24 bg-white overflow-hidden text-slate-900 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 className={cn("text-4xl md:text-6xl font-medium leading-tight mb-8 max-w-3xl mx-auto tracking-tight text-slate-900", playfair.className)}>
                        Ku guulayso yoolalka waxbarasho ee waaweyn
                    </h2>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
                                    activeTab === tab.id
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Card */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
                >
                    {/* Left: Course List */}
                    <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-black mb-6 text-slate-900">Koorsooyinka Xisaabta</h3>
                                <ul className="space-y-4">
                                    {MATH_COURSES.map((course, idx) => (
                                        <li key={idx} className="flex items-center group cursor-pointer">
                                            <span className="text-slate-500 font-medium group-hover:text-blue-600 transition-colors">{course}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4">
                                <button className="text-slate-400 text-xs font-bold border-b border-dashed border-slate-300 hover:text-blue-600 hover:border-blue-600 transition-all">
                                    17 koorso oo dheeraad ah
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Interactive Area */}
                    <div className="lg:col-span-8 bg-white p-6 md:p-12 flex items-center justify-center min-h-[400px] relative">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                        <div className="w-full max-w-lg aspect-[1.5/1] bg-white rounded-2xl flex flex-col items-center justify-center relative select-none border border-slate-100 shadow-sm z-10">
                            {/* Interactive Simulation Placeholder */}
                            <div className="relative mb-12 transform hover:scale-105 transition-transform duration-500">
                                <div
                                    className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/20"
                                >
                                    <span className="text-white text-[10px] absolute -top-10 font-mono bg-slate-900 px-2 py-1 rounded">360°</span>
                                    <div className="w-full h-full border-2 border-dashed border-white/30 rounded-full scale-125 animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-0 border border-white/20 rounded-full scale-75" />
                                </div>
                            </div>

                            {/* Slider UI */}
                            <div className="w-full max-w-xs space-y-8">
                                <div className="h-2 w-full bg-slate-100 rounded-full relative">
                                    <div className="absolute top-1/2 left-0 w-1/4 h-full bg-blue-600 rounded-full -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-3/4 w-5 h-5 bg-white border-4 border-slate-900 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-lg cursor-grab hover:scale-110 transition-transform" />

                                    {/* Tick marks */}
                                    {[0, 25, 50, 75, 100].map((pos) => (
                                        <div
                                            key={pos}
                                            className="absolute top-1/2 w-1 h-1 bg-slate-300 rounded-full -translate-y-1/2"
                                            style={{ left: `${pos}%` }}
                                        />
                                    ))}
                                </div>

                                <div className="text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Xaglaha Dibadda</span>
                                </div>
                            </div>

                            {/* Cursor Decoration */}
                            <div className="absolute bottom-12 right-12 text-slate-900 animate-bounce">
                                <MousePointer2 className="h-6 w-6 rotate-[-15deg] fill-slate-900 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
