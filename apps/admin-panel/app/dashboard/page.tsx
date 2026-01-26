"use client";

import { StatsCard } from "@repo/ui";
import { Users, ListTodo, Wallet, AlertOctagon } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Toplam Kullanıcı"
                    value="0"
                    icon={Users}
                    colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                />
                <StatsCard
                    label="Aktif Görevler"
                    value="0"
                    icon={ListTodo}
                    colorClass="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                />
                <StatsCard
                    label="Bakiye Havuzu"
                    value="0.00₺"
                    icon={Wallet}
                    colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                />
                <StatsCard
                    label="Bekleyen Onaylar"
                    value="0"
                    icon={AlertOctagon}
                    colorClass="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Son Üyelikler</h3>
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-500">
                        Veri yok
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Son Çekim Talepleri</h3>
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-500">
                        Veri yok
                    </div>
                </div>
            </div>
        </div>
    );
}
