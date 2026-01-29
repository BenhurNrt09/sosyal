"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@repo/ui";
import { Users, ListTodo, Wallet, AlertOctagon, Loader2, ArrowRight, UserPlus, FileText, Bell, CheckSquare } from "lucide-react";
import { getAdminStats } from "@/actions/stats";
import { getAllNotifications } from "@/actions/notifications";
import { getGlobalSubmissions } from "@/actions/submissions";
import { createClient } from "@repo/lib/src/supabase";
import Link from "next/link";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
    const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();

        // Realtime Subscriptions
        const supabase = createClient();
        const channels = [
            supabase.channel('admin_stats_profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => loadStats(false)).subscribe(),
            supabase.channel('admin_stats_tickets').on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => loadStats(false)).subscribe(),
            supabase.channel('admin_stats_withdrawals').on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawal_requests' }, () => loadStats(false)).subscribe()
        ];

        return () => {
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, []);

    async function loadStats(showLoading = true) {
        if (showLoading) setLoading(true);
        const [statsResult, notificationsResult, submissionsResult] = await Promise.all([
            getAdminStats(),
            getAllNotifications(),
            getGlobalSubmissions()
        ]);
        setStats(statsResult);
        if (notificationsResult.notifications) {
            setRecentNotifications(notificationsResult.notifications.slice(0, 5));
        }
        if (submissionsResult.data) {
            setRecentSubmissions(submissionsResult.data.slice(0, 5));
        }
        setLoading(false);
    }

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Sistem genelindeki verilere göz atın</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    CANLI VERİ AKIŞI AKTİF
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Toplam Kullanıcı"
                    value={stats?.stats?.userCount?.toString() || "0"}
                    icon={Users}
                    colorClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400"
                />
                <StatsCard
                    label="Toplam Destek & Görev"
                    value={stats?.stats?.taskCount?.toString() || "0"}
                    icon={FileText}
                    colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                />
                <StatsCard
                    label="Bakiye Havuzu"
                    value={`${(stats?.stats?.totalBalance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺`}
                    icon={Wallet}
                    colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                />
                <StatsCard
                    label="Bekleyen Olaylar"
                    value={stats?.stats?.pendingCount?.toString() || "0"}
                    icon={AlertOctagon}
                    colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Son Üyelikler */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Son Üyelikler</h3>
                        <Link href="/dashboard/users" className="text-xs font-bold text-cyan-600 hover:underline flex items-center">
                            Tümünü Gör <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentUsers?.map((u: any) => (
                            <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                                        {(u.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{u.username || 'Kullanıcı'}</div>
                                        <div className="text-[10px] text-slate-400">{u.email}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-medium text-slate-400">
                                    {new Date(u.created_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Son Çekim Talepleri */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Son Çekim Talepleri</h3>
                        <Link href="/dashboard/finance" className="text-xs font-bold text-cyan-600 hover:underline flex items-center">
                            Tümünü Gör <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentWithdrawals?.map((w: any) => (
                            <div key={w.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{w.profiles?.username || 'Kullanıcı'}</div>
                                        <div className="text-[10px] text-slate-400">{w.bank_name} - {w.amount}₺</div>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${w.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                    w.status === 'completed' ? 'bg-green-100 text-green-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                    {w.status === 'pending' ? 'BEKLEMEDE' : w.status === 'completed' ? 'TAMAMLANDI' : 'REDEİLDİ'}
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentWithdrawals || stats.recentWithdrawals.length === 0) && (
                            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-medium">
                                Talep bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Son Bildirimler */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Son Bildirimler</h3>
                        <Link href="/dashboard/notifications" className="text-xs font-bold text-cyan-600 hover:underline flex items-center">
                            Tümünü Gör <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentNotifications.map((n) => (
                            <div key={n.id} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</div>
                                    <div className="text-[10px] text-slate-400 line-clamp-1">{n.message}</div>
                                </div>
                                <div className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                                    {new Date(n.created_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        ))}
                        {recentNotifications.length === 0 && (
                            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                                Bildirim bulunamadı.
                            </div>
                        )}
                    </div>
                </div>

                {/* Son Görevler (Tamamlananlar veya Yeni Başvurular) */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Son Görev Hareketleri</h3>
                        <Link href="/dashboard/submissions" className="text-xs font-bold text-cyan-600 hover:underline flex items-center">
                            Tümünü Gör <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentSubmissions.map((s) => (
                            <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                        s.status === 'approved' ? 'bg-cyan-100 text-cyan-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        <CheckSquare className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                            {s.profiles?.username || 'Kullanıcı'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 truncate">
                                            {s.tasks?.taskTypeName || 'Görev'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-[9px] font-bold px-2 py-1 rounded-full ${s.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                    s.status === 'approved' ? 'bg-cyan-100 text-cyan-600' :
                                        s.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-red-100 text-red-600'
                                    }`}>
                                    {s.status === 'pending' ? 'BEKLEMEDE' : s.status === 'completed' ? 'TAMAMLANDI' : s.status === 'approved' ? 'ONAYLANDI' : 'REDEİLDİ'}
                                </div>
                            </div>
                        ))}
                        {recentSubmissions.length === 0 && (
                            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                                Görev hareketi bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
