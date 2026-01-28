"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, DollarSign } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
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

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Global Başvurular & Kanıtlar</h1>
                <p className="text-slate-500 text-sm">Tüm sistemdeki başvuru ve ödeme süreçlerini yönetin.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-bold text-slate-600">Kullanıcı</th>
                            <th className="p-4 font-bold text-slate-600">Görev</th>
                            <th className="p-4 font-bold text-slate-600">Durum</th>
                            <th className="p-4 font-bold text-slate-600">Kanıt</th>
                            <th className="p-4 font-bold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((sub) => (
                            <tr key={sub.id} className="border-b border-slate-50">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900">{sub.profiles?.username}</p>
                                    <p className="text-xs text-slate-500">{sub.profiles?.name}</p>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-medium">{sub.tasks?.platform_name}</p>
                                    <p className="text-xs text-slate-500">{sub.tasks?.task_type_name}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        sub.status === 'approved' ? 'bg-cyan-100 text-cyan-700' :
                                            sub.status === 'submitted' ? 'bg-cyan-50 text-cyan-600' :
                                                sub.status === 'creator_approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    sub.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs italic text-slate-500 truncate max-w-[100px] block">
                                        {sub.proof_data || '-'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {sub.status === 'pending' && (
                                            <Button
                                                onClick={() => handleApproveApplication(sub.id)}
                                                className="bg-cyan-600 text-white text-xs h-8 px-3 rounded-lg flex items-center gap-1 shadow-md shadow-cyan-100 hover:bg-cyan-700"
                                            >
                                                <ShieldCheck className="w-3 h-3" /> Başvuru Onayla
                                            </Button>
                                        )}
                                        {sub.status === 'creator_approved' && (
                                            <Button
                                                onClick={() => handleFinalApproval(sub.id)}
                                                className="bg-emerald-600 text-white text-xs h-8 px-3 rounded-lg flex items-center gap-1 shadow-lg shadow-emerald-100"
                                            >
                                                <DollarSign className="w-3 h-3" /> Ödemeyi Tamamla
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
