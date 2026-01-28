"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@repo/ui";

export default function Home() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
            {/* Ambient Background Effects */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

            <div className="relative z-10 container mx-auto flex flex-col items-center gap-8 px-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-2xl shadow-cyan-500/30 ring-1 ring-white/20">
                    <LayoutDashboard className="h-10 w-10 text-white" />
                </div>

                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Admin Paneli
                    </h1>
                    <p className="text-lg text-slate-400 sm:text-xl">
                        Sosyal görev platformu yönetim merkezi. İstatistikler, kullanıcı yönetimi ve sistem ayarları.
                    </p>
                </div>

                <div className="group relative">
                    <div className="absolute -inset-1 rounded-full bg-cyan-600 opacity-70 blur transition duration-200 group-hover:opacity-100" />
                    <Link href="/login">
                        <Button size="lg" className="relative bg-slate-900 border-slate-800 text-white hover:bg-slate-800 space-x-2 pl-8 pr-6 h-12 rounded-full text-base">
                            <span>Admin Girişi</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-6 flex gap-6 text-sm text-slate-500">
                <span>Versiyon 1.0.0</span>
                <span>•</span>
                <span>Güvenli Bağlantı</span>
            </div>
        </div>
    );
}
