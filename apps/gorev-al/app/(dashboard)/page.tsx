import { StatsCard } from "@repo/ui/components/ui/stats-card";
import { Clock, Wallet, CheckCircle2, Bell } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Bekleyen Görevler"
                    value="0"
                    icon={Clock}
                    colorClass="bg-orange-100 text-orange-600"
                />
                <StatsCard
                    label="Cüzdan"
                    value="0.00₺"
                    icon={Wallet}
                    colorClass="bg-emerald-100 text-emerald-600"
                />
                <StatsCard
                    label="Tamamlanan"
                    value="0"
                    icon={CheckCircle2}
                    colorClass="bg-blue-100 text-blue-600"
                />
                <StatsCard
                    label="Bildirimler"
                    value="0"
                    icon={Bell}
                    colorClass="bg-purple-100 text-purple-600"
                />
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Yeni Görevler</h2>
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                    Şu an görev bulunmuyor
                </div>
            </div>
        </div>
    );
}
