"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <section className="py-24 bg-[#0A0A0A] overflow-hidden text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className={cn("text-4xl md:text-6xl font-medium leading-tight mb-12 max-w-3xl mx-auto tracking-tight", playfair.className)}>
                        Ku guulayso yoolalka waxbarasho ee waaweyn
                    </h2>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-black transition-all duration-300 border border-white/5",
                                    activeTab === tab.id
                                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-12 bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
                >
                    {/* Left: Course List */}
                    <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-black mb-6 dark:text-white">Koorsooyinka Xisaabta</h3>
                                <ul className="space-y-4">
                                    {MATH_COURSES.map((course, idx) => (
                                        <li key={idx} className="flex items-center group cursor-pointer">
                                            <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{course}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4">
                                <button className="text-gray-500 text-xs font-bold border-b border-dashed border-gray-700 hover:text-white hover:border-white transition-all">
                                    17 koorso oo dheeraad ah
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Interactive Area */}
                    <div className="lg:col-span-8 bg-white p-6 md:p-12 flex items-center justify-center min-h-[400px] relative">
                        <div className="w-full max-w-lg aspect-[1.5/1] bg-white rounded-2xl flex flex-col items-center justify-center relative select-none">
                            {/* Interactive Simulation Placeholder */}
                            <div className="relative mb-12">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30"
                                >
                                    <span className="text-white text-[10px] absolute -top-4 font-mono">360°</span>
                                    <div className="w-full h-full border-2 border-dashed border-black/10 rounded-full scale-125" />
                                </motion.div>
                            </div>

                            {/* Slider UI */}
                            <div className="w-full max-w-xs space-y-8">
                                <div className="h-1.5 w-full bg-gray-200 rounded-full relative">
                                    <div className="absolute top-1/2 left-0 w-1/4 h-full bg-blue-500 rounded-full -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-3/4 w-3.5 h-3.5 bg-white border-2 border-gray-800 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform" />

                                    {/* Tick marks */}
                                    <div className="absolute top-1/2 left-0 w-0.5 h-2 bg-gray-300 -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-1/4 w-0.5 h-2 bg-gray-300 -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-gray-300 -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-3/4 w-0.5 h-2 bg-gray-300 -translate-y-1/2" />
                                    <div className="absolute top-1/2 left-full w-0.5 h-2 bg-gray-300 -translate-y-1/2" />
                                </div>

                                <div className="text-center">
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Xaglaha Dibadda</span>
                                </div>
                            </div>

                            {/* Cursor Decoration */}
                            <div className="absolute bottom-12 right-12 text-gray-400">
                                <MousePointer2 className="h-6 w-6 rotate-[-15deg] fill-gray-100" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
