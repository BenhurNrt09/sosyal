"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, DollarSign, Loader2, User, FileText, CheckCircle2 } from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";
import { getGlobalSubmissions, updateGlobalSubmissionStatus, completeSubmissionAndPay } from "@/actions/submissions";

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllSubmissions();
    }, []);

    const loadAllSubmissions = async () => {
        setLoading(true);
        const { data } = await getGlobalSubmissions();
        if (data) {
            setSubmissions(data);
        }
        setLoading(false);
    };

    const handleApproveApplication = async (id: string) => {
        const result = await updateGlobalSubmissionStatus(id, 'approved');
        if (result.success) loadAllSubmissions();
    };

    const handleFinalApproval = async (id: string) => {
        const result = await completeSubmissionAndPay(id);
        if (result.success) {
            alert("Görev başarıyla tamamlandı ve ödeme yapıldı!");
            loadAllSubmissions();
        } else {
            alert("Ödeme sırasında bir hata oluştu: " + result.error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Panel</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium tracking-tight">Global Başvurular & Kanıt Yönetimi</p>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">KULLANICI</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">GÖREV DETAYI</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">DURUM</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">KANIT VERİSİ</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Başvurular yükleniyor...</p>
                                        </td>
                                    </tr>
                                ) : submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                                <FileText className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Henüz bir başvuru bulunmuyor.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.map((sub) => (
                                        <tr key={sub.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-11 w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 shadow-sm border border-white/10">
                                                        {(sub.profiles?.username || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{sub.profiles?.username}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sub.profiles?.name || 'İsimsiz'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="text-sm font-black text-slate-800 dark:text-slate-200">{sub.tasks?.platform_name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sub.tasks?.task_type_name}</div>
                                            </td>
                                            <td className="px-8 py-7 text-center">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${sub.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                                    sub.status === 'approved' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400' :
                                                        sub.status === 'submitted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                            sub.status === 'creator_approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                                sub.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${sub.status === 'pending' ? 'bg-amber-500' :
                                                        (sub.status === 'approved' || sub.status === 'submitted') ? 'bg-cyan-500' :
                                                            (sub.status === 'creator_approved' || sub.status === 'completed') ? 'bg-emerald-500' : 'bg-rose-500'
                                                        }`} />
                                                    {sub.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 max-w-[200px] truncate">
                                                    {sub.proof_data || <span className="text-[10px] font-black opacity-30">VERİ YOK</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {sub.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleApproveApplication(sub.id)}
                                                            className="h-10 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-200 transition-all flex items-center gap-2"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> ONAYLA
                                                        </button>
                                                    )}
                                                    {sub.status === 'creator_approved' && (
                                                        <button
                                                            onClick={() => handleFinalApproval(sub.id)}
                                                            className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
                                                        >
                                                            <DollarSign className="w-3.5 h-3.5" /> ÖDEMEYİ YAP
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
