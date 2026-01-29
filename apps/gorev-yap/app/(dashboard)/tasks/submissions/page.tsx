"use client";

import { useState, useEffect, useTransition } from "react";
import { getSubmissionsForCreator, subscribeToTasks, Submission } from "@repo/lib";
import { approveAndPaySubmission, rejectSubmission } from "@/actions/submissions";
import { createClient } from "@repo/lib/src/supabase";
import { Check, X, Eye, User, Clock, AlertCircle } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

export default function ReviewSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        loadSubmissions();
        const unsubscribe = subscribeToTasks(() => loadSubmissions());
        return unsubscribe;
    }, []);

    const loadSubmissions = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const data = await getSubmissionsForCreator(user.id);
            // Only show submitted and completed tasks for creator review
            // But usually we review 'submitted'
            setSubmissions(data.filter(s => s.status === 'submitted' || s.status === 'completed' || s.status === 'creator_approved'));
        }
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Bu görevi onaylıyor musunuz? Onayladıktan sonra ödeme otomatik olarak gerçekleşecektir.")) return;

        startTransition(async () => {
            const result = await approveAndPaySubmission(id);
            if (result.success) {
                loadSubmissions();
                alert("Başarıyla onaylandı ve ödeme yapıldı!");
            } else {
                alert(result.error);
            }
        });
    };

    const handleReject = async (id: string) => {
        if (!confirm("Bu görevi reddetmek istediğinize emin misiniz?")) return;

        startTransition(async () => {
            const result = await rejectSubmission(id);
            if (result.success) {
                loadSubmissions();
            } else {
                alert(result.error);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Kanıt İnceleme</h1>
                <p className="text-slate-500 font-medium">Görevlerinizi yapan kişilerin gönderdiği kanıtları inceleyip ödemeyi onaylayın.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-hidden">
                {submissions.length === 0 ? (
                    <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-400 uppercase tracking-tight">Kayıt Bulunmuyor</h3>
                        <p className="text-slate-400 font-medium text-sm">Şu an incelenecek kanıt bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-6 px-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Kullanıcı</th>
                                    <th className="text-left py-6 px-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Görev</th>
                                    <th className="text-left py-6 px-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Kanıt</th>
                                    <th className="text-left py-6 px-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Durum</th>
                                    <th className="text-right py-6 px-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                                                    <User className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <span className="font-black text-slate-900 text-sm block">{sub.user?.username || "Anonim"}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sub.user?.full_name || 'İsim Bilgisi Yok'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700">
                                                    {sub.task?.platformName}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {sub.task?.taskTypeName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <button
                                                onClick={() => setSelectedProof(sub.proofData)}
                                                className="h-10 px-4 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-slate-100"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> İncele
                                            </button>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 
                                                ${sub.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                                                    sub.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${sub.status === 'submitted' ? 'bg-amber-500' : sub.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                                {sub.status === 'submitted' ? 'İnceleme Bekliyor' :
                                                    sub.status === 'completed' ? 'Tamamlandı' :
                                                        sub.status === 'creator_approved' ? 'Onaylandı' : sub.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            {(sub.status === 'submitted' || sub.status === 'creator_approved') && (
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        onClick={() => handleApprove(sub.id)}
                                                        disabled={isPending}
                                                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200/50 text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        {isPending ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <>ONAYLA & ÖDE</>}
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleReject(sub.id)}
                                                        disabled={isPending}
                                                        className="h-9 w-9 p-0 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-100 transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Proof Modal */}
            {selectedProof && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-4xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => setSelectedProof(null)}
                            className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                                <FileText className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Kanıt Detayı</h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Lütfen gönderilen veriyi dikkatlice inceleyin</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 overflow-auto max-h-[60vh] shadow-inner">
                            {selectedProof.startsWith('http') ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KANIT ADRESİ</span>
                                        <a href={selectedProof} target="_blank" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
                                            YENİ SEKMEDE AÇ <ExternalLink size={12} />
                                        </a>
                                    </div>
                                    <img src={selectedProof} alt="Görev Kanıtı" className="w-full h-auto rounded-2xl shadow-lg border border-white" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">METİN KANIT / KULLANICI ADI</span>
                                    <div className="text-slate-700 dark:text-slate-200 text-xl font-black bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm leading-relaxed">
                                        {selectedProof}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 flex gap-4">
                            <Button
                                onClick={() => setSelectedProof(null)}
                                className="flex-1 h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95"
                            >
                                Kapalı
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple internal interface for icon
function FileText({ className }: { className?: string }) {
    return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;
}

function ExternalLink({ size }: { size?: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;
}
