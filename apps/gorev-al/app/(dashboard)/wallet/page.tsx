import { Button } from "@repo/ui/components/ui/button";
import { Wallet, TrendingUp, Clock } from "lucide-react";

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Cüzdanım</h2>
            <p className="text-slate-500">Kazançlarını ve ödemelerini buradan yönetebilirsin.</p>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Main Balance Card */}
                <div className="col-span-1 rounded-xl border bg-white p-8 shadow-sm">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Mevcut Bakiye</p>
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900">0.00</span>
                        <span className="text-xl font-medium text-slate-500">₺</span>
                    </div>
                    <div className="mt-6">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                            Para Çekme Talebi Oluştur
                        </Button>
                    </div>
                </div>

                {/* Stats Column */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="flex flex-1 items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Toplam Kazanç</p>
                            <div className="mt-1 text-2xl font-bold text-slate-900">₺0.00</div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="flex flex-1 items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-slate-500">İncelemede</p>
                            <div className="mt-1 text-2xl font-bold text-orange-600">₺0.00</div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm min-h-[200px]">
                <h3 className="mb-4 font-bold text-slate-800">Son İşlemler</h3>
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Wallet className="mb-2 h-10 w-10 opacity-20" />
                    <p>Henüz işlem bulunmuyor</p>
                </div>
            </div>
        </div>
    );
}
