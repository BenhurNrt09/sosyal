"use client";

import { Clock, Wallet, CheckCircle2, Bell, Megaphone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardStats, getLatestAnnouncements } from "@/actions/dashboard";

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
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Bekleyen Görevler */}
                <StatCard
                    icon={<Clock />}
                    label="Bekleyen Görevler"
                    value={stats.pendingTasks.toString()}
                    color="violet"
                />

                {/* Cüzdan */}
                <StatCard
                    icon={<Wallet />}
                    label="Cüzdan"
                    value={`₺${stats.balance.toFixed(2)}`}
                    color="emerald"
                />

                {/* Tamamlanan */}
                <StatCard
                    icon={<CheckCircle2 />}
                    label="Tamamlanan"
                    value={stats.completedTasks.toString()}
                    color="blue"
                />

                {/* Bildirimler */}
                <StatCard
                    icon={<Bell />}
                    label="Bildirimler"
                    value={stats.unreadNotifications.toString()}
                    color="purple"
                />
            </div>

            {/* Yeni Görevler */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Yeni Görevler</h2>
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[120px] flex items-center justify-center text-slate-400">
                    Şu an görev bulunmuyor
                </div>
            </div>

            {/* Son Duyurular */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Son Duyurular</h2>
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                    {announcements.length > 0 ? announcements.map((ann, idx) => (
                        <div key={idx} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{ann.title}</h3>
                                <p className="text-xs text-slate-500 mb-1 line-clamp-1">{ann.message}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{new Date(ann.created_at).toLocaleDateString('tr-TR')}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-slate-400 font-medium">
                            Henüz duyuru bulunmuyor
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        violet: "bg-violet-100 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-500",
        blue: "bg-blue-50 text-blue-500",
        purple: "bg-purple-50 text-purple-500"
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                </div>
            </div>
        </div>
    );
}
