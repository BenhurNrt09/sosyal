"use client";

import { ShieldAlert, AlertCircle, CheckCircle, Clock, Loader2, Search, Target } from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";
import { useState } from "react";

export default function ModerationPage() {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium tracking-tight">İçerik ve Gönderi Moderasyon Merkezi</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <StatBox icon={<Clock className="w-7 h-7" />} label="Bekleyen" value="0" color="amber" />
                <StatBox icon={<CheckCircle className="w-7 h-7" />} label="Onaylanan" value="0" color="emerald" />
                <StatBox icon={<AlertCircle className="w-7 h-7" />} label="Reddedilen" value="0" color="rose" />
                <StatBox icon={<ShieldAlert className="w-7 h-7" />} label="Şikayetler" value="0" color="cyan" />
            </div>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                placeholder="İçeriklerde veya kullanıcı adında ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-14 pr-8 bg-slate-50 dark:bg-slate-800/30 border-none rounded-2xl text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {["all", "pending", "reports"].map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={`px-5 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${filter === key
                                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-100"
                                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {key === 'all' ? 'TÜMÜ' : key === 'pending' ? 'BEKLEYEN' : 'RAPORLAR'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TARİH</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">KULLANICI</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">İÇERİK</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">DURUM</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <Target className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Moderasyon bekleyen içerik bulunmuyor</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-10">
                    <h2 className="mb-8 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Son İşlemler</h2>
                    <div className="flex h-40 items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 font-bold text-sm tracking-tight">
                        Henüz bir moderasyon işlemi gerçekleştirilmedi.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatBox({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colors: any = {
        amber: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-50 dark:border-amber-900/10",
        emerald: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-50 dark:border-emerald-900/10",
        rose: "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-50 dark:border-rose-900/10",
        cyan: "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-50 dark:border-cyan-900/10",
    };
    return (
        <div className={`rounded-[2.2rem] border p-8 shadow-sm bg-white dark:bg-slate-900/50 ${colors[color]}`}>
            <div className="flex items-center gap-5">
                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.2rem] ${colors[color]} shadow-sm brightness-95`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] opacity-70">{label}</p>
                    <p className="text-3xl font-black tracking-tight mt-0.5">{value}</p>
                </div>
            </div>
        </div>
    );
}
