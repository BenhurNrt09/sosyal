"use client";

import { Clock, Wallet, CheckCircle2, Bell, Megaphone, Loader2, Zap, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardStats, getLatestAnnouncements } from "@/actions/dashboard";
import { Card, CardContent } from "@repo/ui";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        balance: 0,
        pendingTasks: 0,
        completedTasks: 0,
        unreadNotifications: 0
    });
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const statsData = await getDashboardStats();
            const announcementsData = await getLatestAnnouncements();
            if (!(statsData as any).error) setStats(statsData as any);
            setAnnouncements(announcementsData);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Veriler Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">Hesabınıza ait kazanç ve görev istatistikleri</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-12 px-5 bg-violet-600/10 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center gap-2 border border-violet-200/50 dark:border-violet-500/20">
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">VIP Seviye: 1</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={<Clock className="w-7 h-7" />}
                    label="BEKLEYEN"
                    value={stats.pendingTasks.toString()}
                    color="violet"
                />
                <StatCard
                    icon={<Wallet className="w-7 h-7" />}
                    label="KAZANÇ"
                    value={`₺${stats.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                    color="emerald"
                />
                <StatCard
                    icon={<CheckCircle2 className="w-7 h-7" />}
                    label="BİTEN"
                    value={stats.completedTasks.toString()}
                    color="blue"
                />
                <StatCard
                    icon={<Bell className="w-7 h-7" />}
                    label="BİLDİRİM"
                    value={stats.unreadNotifications.toString()}
                    color="rose"
                />
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Yeni Görevler */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Yeni Görevler</h2>
                        <button className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest hover:underline flex items-center gap-2">
                            GÖREVLERE GİT <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                        <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mb-6">
                                <Zap className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[11px]">Şu an yeni görev bulunmuyor</p>
                            <p className="text-slate-400 text-xs mt-2">Sistem her saat başı güncellenmektedir.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Son Duyurular */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Son Duyurular</h2>
                    </div>
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {announcements.length > 0 ? announcements.map((ann, idx) => (
                                    <div key={idx} className="p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
                                        <div className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Megaphone size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm mb-1 leading-tight group-hover:text-violet-600 transition-colors">{ann.title}</h3>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">{ann.message}</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">{new Date(ann.created_at).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 flex flex-col items-center justify-center text-center">
                                        <Megaphone className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-4" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Henüz duyuru yayınlanmamış</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colors: any = {
        violet: "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-50 dark:border-violet-900/10",
        emerald: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-50 dark:border-emerald-900/10",
        blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-50 dark:border-blue-900/10",
        rose: "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-50 dark:border-rose-900/10",
    };
    return (
        <div className={`rounded-[2.5rem] border p-8 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group ${colors[color]}`}>
            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]} shadow-sm brightness-95 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{label}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
                </div>
            </div>
        </div>
    );
}
