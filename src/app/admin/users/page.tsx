"use client";

import React, { Suspense } from "react";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel";
import { Loader2 } from "lucide-react";

function UsersFallback() {
    return (
        <div className="flex justify-center py-20 rounded-3xl border border-gray-100 bg-white">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
    );
}

export default function AdminUsersPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Isticmaalayaasha</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
                        Liiska dhammaan · email, telefoon, WhatsApp
                    </p>
                </div>
            </div>
            <Suspense fallback={<UsersFallback />}>
                <AdminUsersPanel />
            </Suspense>
        </div>
    );
}
