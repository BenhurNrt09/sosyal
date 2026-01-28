"use client";

import { Clock, Wallet, CheckCircle2, Bell, Megaphone } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Bekleyen Görevler */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Bekleyen Görevler</p>
                            <h3 className="text-3xl font-black text-slate-900">0</h3>
                        </div>
                    </div>
                </div>

                {/* Cüzdan */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Cüzdan</p>
                            <h3 className="text-3xl font-black text-slate-900">0.00₺</h3>
                        </div>
                    </div>
                </div>

                {/* Tamamlanan */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Tamamlanan</p>
                            <h3 className="text-3xl font-black text-slate-900">0</h3>
                        </div>
                    </div>
                </div>

                {/* Bildirimler */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Bildirimler</p>
                            <h3 className="text-3xl font-black text-slate-900">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Yeni Görevler */}
            <div>
                <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Yeni Görevler</h2>
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[120px] flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Şu an aktif görev bulunmuyor
                </div>
            </div>

            {/* Son Duyurular */}
            <div>
                <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Son Duyurular</h2>
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                    <div className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Megaphone size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Yeni Instagram görevleri eklendi!</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">2 saat önce</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Megaphone size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Para çekme limiti 100₺'ye düşürüldü</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">1 gün önce</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
