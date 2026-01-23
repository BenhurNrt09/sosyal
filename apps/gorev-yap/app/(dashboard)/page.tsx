import { StatsCard } from "@repo/ui/components/ui/stats-card";
import { Users, CheckCircle2, Wallet, Activity } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Panel</h2>
                <Button className="bg-orange-600 hover:bg-orange-700">Yeni Görev Oluştur</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Aktif Görevler"
                    value="0"
                    icon={Activity}
                    colorClass="bg-blue-100 text-blue-600"
                />
                <StatsCard
                    label="Tamamlananlar"
                    value="0"
                    icon={CheckCircle2}
                    colorClass="bg-green-100 text-green-600"
                />
                <StatsCard
                    label="Toplam Harcanan"
                    value="0.00₺"
                    icon={Wallet}
                    colorClass="bg-orange-100 text-orange-600"
                />
                <StatsCard
                    label="Etkileşim"
                    value="0"
                    icon={Users}
                    colorClass="bg-purple-100 text-purple-600"
                />
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Son Aktiviteler</h3>
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                    Henüz aktivite bulunmuyor.
                </div>
            </div>
        </div>
    );
}
