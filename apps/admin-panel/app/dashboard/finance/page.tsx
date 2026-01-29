"use client";

import { Wallet, TrendingDown, Loader2, Check, X } from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";
import { useState, useEffect } from "react";
import { getWithdrawalRequests, updateWithdrawalStatus } from "@/actions/finance";

export default function FinancePage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalOutcome: 0,
        pendingWithdrawals: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        const result = await getWithdrawalRequests();
        if (result.requests) {
            setRequests(result.requests);

            const pendingTotal = result.requests
                .filter((r: any) => r.status === 'pending')
                .reduce((acc: number, r: any) => acc + r.amount, 0);

            const approvedTotal = result.requests
                .filter((r: any) => r.status === 'approved')
                .reduce((acc: number, r: any) => acc + r.amount, 0);

            setStats({
                totalBalance: 0,
                totalOutcome: approvedTotal,
                pendingWithdrawals: pendingTotal
            });
        }
        setLoading(false);
    }

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected', userId: string, amount: number) => {
        if (!confirm(`Talebi ${status === 'approved' ? 'onaylamak' : 'reddetmek'} istediğinize emin misiniz?`)) return;

        const result = await updateWithdrawalStatus(id, status, userId, amount);
        if (result.success) {
            loadData();
        } else {
            alert("Hata: " + result.error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">Finansal işlemleri ve raporları görüntüleyin</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600">
                            <Wallet className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Toplam Çıkış</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {stats.totalOutcome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-orange-600">
                            <TrendingDown className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bekleyen Çekim</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                {stats.pendingWithdrawals.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-10">
                    <h2 className="mb-8 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Bekleyen Çekim Talepleri</h2>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-10 w-10 animate-spin text-cyan-600" />
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50 dark:border-slate-800">
                                        <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kullanıcı</th>
                                        <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Banka Bilgisi</th>
                                        <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Tutar</th>
                                        <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Tarih</th>
                                        <th className="pb-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {requests.filter(r => r.status === 'pending').length > 0 ? (
                                        requests.filter(r => r.status === 'pending').map((request) => (
                                            <tr key={request.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-7">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                                                            {(request.profiles?.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-900 dark:text-white">{request.profiles?.username}</div>
                                                            <div className="text-[11px] font-bold text-slate-400">{request.profiles?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-7">
                                                    <div className="text-sm">
                                                        <div className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px] tracking-tight">{request.bank_name}</div>
                                                        <div className="text-xs font-medium text-slate-400 mt-0.5">{request.iban}</div>
                                                        <div className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 mt-1 uppercase">{request.account_holder_name}</div>
                                                    </div>
                                                </td>
                                                <td className="py-7 text-center">
                                                    <div className="font-black text-slate-900 dark:text-white">{request.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺</div>
                                                </td>
                                                <td className="py-7 text-center">
                                                    <div className="text-[11px] font-bold text-slate-400">
                                                        {new Date(request.created_at).toLocaleDateString('tr-TR')}
                                                    </div>
                                                </td>
                                                <td className="py-7 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'approved', request.user_id, request.amount)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 transition-all shadow-sm"
                                                            title="Onayla"
                                                        >
                                                            <Check className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'rejected', request.user_id, request.amount)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800 hover:bg-rose-100 transition-all shadow-sm"
                                                            title="Reddet"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-slate-400 font-bold text-sm">
                                                Bekleyen çekim talebi bulunmuyor.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-10">
                    <h2 className="mb-8 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">İşlem Geçmişi</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tarih</th>
                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kullanıcı</th>
                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Durum</th>
                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {requests.filter(r => r.status !== 'pending').length > 0 ? (
                                    requests.filter(r => r.status !== 'pending').map((request) => (
                                        <tr key={request.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-6 text-[11px] font-bold text-slate-500">
                                                {new Date(request.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="py-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{request.profiles?.username}</td>
                                            <td className="py-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest inline-flex items-center gap-1.5 ${request.status === 'approved' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${request.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {request.status === 'approved' ? 'ONAYLANDI' : 'REDDEDİLDİ'}
                                                </span>
                                            </td>
                                            <td className="py-6 font-black text-slate-900 dark:text-white text-center">{request.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}₺</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-400 font-bold text-sm">
                                            İşlem bulunmuyor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
