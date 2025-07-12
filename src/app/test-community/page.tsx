"use client";

import React from 'react';
import { Header } from '@/components/Header';
import CommunityTest from '@/components/community/CommunityTest';

export default function TestCommunityPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />
            <div className="max-w-7xl mx-auto pt-20">
                <CommunityTest />
            </div>
        </div>
    );
} 