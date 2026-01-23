import { StatsCard } from "@repo/ui/components/ui/stats-card";
import { Users, ListTodo, Wallet, AlertOctagon } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Toplam Kullanıcı"
                    value="0"
                    icon={Users}
                    colorClass="bg-blue-100 text-blue-600"
                />
                <StatsCard
                    label="Aktif Görevler"
                    value="0"
                    icon={ListTodo}
                    colorClass="bg-green-100 text-green-600"
                />
                <StatsCard
                    label="Bakiye Havuzu"
                    value="0.00₺"
                    icon={Wallet}
                    colorClass="bg-orange-100 text-orange-600"
                />
                <StatsCard
                    label="Bekleyen Onaylar"
                    value="0"
                    icon={AlertOctagon}
                    colorClass="bg-red-100 text-red-600"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Son Üyelikler</h3>
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                        Veri yok
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Son Çekim Talepleri</h3>
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
                        Veri yok
                    </div>
                </div>
            </div>
        </div>
    );
}
