"use client";

import { Wallet, TrendingUp, TrendingDown, Download, Loader2, Check, X, Building2 } from "lucide-react";
import { Button } from "@repo/ui";
import { useState, useEffect } from "react";
import { getWithdrawalRequests, updateWithdrawalStatus } from "@/actions/finance";

export default function FinancePage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalIncome: 0,
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

            // Calculate stats
            const pending = result.requests.filter((r: any) => r.status === 'pending');
            const outcome = result.requests.filter((r: any) => r.status === 'approved')
                .reduce((acc: number, r: any) => acc + r.amount, 0);
            const pendingTotal = pending.reduce((acc: number, r: any) => acc + r.amount, 0);

            setStats({
                totalBalance: 0, // Should be sum of all user balances
                totalIncome: 0, // Should be sum of all deposits
                totalOutcome: outcome,
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Finans</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Finansal işlemleri ve raporları görüntüleyin</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Toplam Çıkış</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.totalOutcome.toFixed(2)}₺</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Bekleyen Çekim</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.pendingWithdrawals.toFixed(2)}₺</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Bekleyen Çekim Talepleri</h2>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Kullanıcı</th>
                                    <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Banka Bilgisi</th>
                                    <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Tutar</th>
                                    <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Tarih</th>
                                    <th className="pb-3 text-right text-xs font-semibold uppercase text-slate-500">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {requests.filter(r => r.status === 'pending').length > 0 ? (
                                    requests.filter(r => r.status === 'pending').map((request) => (
                                        <tr key={request.id}>
                                            <td className="py-4">
                                                <div>
                                                    <div className="font-bold text-slate-900">{request.profiles?.username}</div>
                                                    <div className="text-xs text-slate-500">{request.profiles?.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-sm">
                                                    <div className="font-medium text-slate-700">{request.bank_name}</div>
                                                    <div className="text-xs text-slate-500">{request.iban}</div>
                                                    <div className="text-xs font-bold text-slate-400">{request.account_holder_name}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 font-bold text-slate-900">{request.amount.toFixed(2)}₺</td>
                                            <td className="py-4 text-sm text-slate-500">
                                                {new Date(request.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(request.id, 'approved', request.user_id, request.amount)}
                                                        className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(request.id, 'rejected', request.user_id, request.amount)}
                                                        className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            Bekleyen talep bulunmuyor
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">İşlem Geçmişi</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 text-left">
                                <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Tarih</th>
                                <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Kullanıcı</th>
                                <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Durum</th>
                                <th className="pb-3 text-xs font-semibold uppercase text-slate-500">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.filter(r => r.status !== 'pending').length > 0 ? (
                                requests.filter(r => r.status !== 'pending').map((request) => (
                                    <tr key={request.id}>
                                        <td className="py-4 text-sm text-slate-500">
                                            {new Date(request.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="py-4 text-sm font-medium text-slate-900">{request.profiles?.username}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {request.status === 'approved' ? 'ONAYLANDI' : 'REDDEDİLDİ'}
                                            </span>
                                        </td>
                                        <td className="py-4 font-bold text-slate-900">{request.amount.toFixed(2)}₺</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-500">
                                        İşlem bulunmuyor
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
