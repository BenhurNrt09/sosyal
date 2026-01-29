"use client";

import { useState, useEffect } from "react";
import { getMySubmissions, subscribeToTasks, submitProof, Submission } from "@repo/lib";
import { createClient } from "@repo/lib/src/supabase";
import { Clock, CheckCircle, XCircle, FileText, ExternalLink, Send, AlertCircle } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-blue-100 text-blue-700", // "In Progress"
        submitted: "bg-purple-100 text-purple-700",
        creator_approved: "bg-indigo-100 text-indigo-700",
        completed: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: "Uygulandı - Onay Bekliyor",
        approved: "İşlemde - Kanıt Bekliyor",
        submitted: "Kanıt Yollandı",
        creator_approved: "Görev Sahibi Onayladı",
        completed: "Tamamlandı & Ödeme Yapıldı",
        rejected: "Reddedildi",
    };
    return labels[status] || status;
};

export default function MyTasksPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [proofInput, setProofInput] = useState<Record<string, string>>({});

    useEffect(() => {
        loadMySubmissions();

        // Subscribe to real-time updates for submissions (not tasks table)
        // For simplicity, we just reload when anything updates if we want true real-time
        // or we could add a specific subscription for submissions.
        // Let's reload on task store update for now.
        const unsubscribe = subscribeToTasks(() => {
            loadMySubmissions();
        });

        return unsubscribe;
    }, []);

    const loadMySubmissions = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getMySubmissions(user.id) as any;
                setSubmissions(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitProof = async (submissionId: string) => {
        const data = proofInput[submissionId];
        if (!data || data.trim() === "") {
            alert("Lütfen kanıt bilgisini (link veya kullanıcı adı) girin.");
            return;
        }

        const success = await submitProof(submissionId, data);
        if (success) {
            alert("Kanıt başarıyla gönderildi! Görev sahibi onayı bekleniyor.");
            setProofInput(prev => ({ ...prev, [submissionId]: "" }));
            loadMySubmissions();
        } else {
            alert("Kanıt gönderilirken bir hata oluştu.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Görevlerim</h1>
                <p className="text-slate-500">Başvurduğunuz ve tamamladığınız görevleri takip edin.</p>
            </div>

            <div className="space-y-4">
                {submissions.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-16 text-center border border-dashed border-slate-300">
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz görev yok</h3>
                        <p className="text-slate-500">Yeni görevler sayfasından başvurarak başlayın!</p>
                    </div>
                ) : (
                    submissions.map((sub) => (
                        <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {sub.task?.platformName} - {sub.task?.taskTypeName}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {sub.task?.accountName} • {new Date(sub.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1 rounded-full text-xs font-bold ${getStatusColor(sub.status)}`}>
                                    {getStatusLabel(sub.status)}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="text-xs text-slate-500">Ödül</p>
                                    <p className="font-bold text-emerald-600">
                                        {sub.task ? (Number(sub.task.price) * Number(sub.task.quantity)).toFixed(2) : "0"}₺
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Link</p>
                                    <a href={sub.task?.link} target="_blank" className="text-sm font-bold text-violet-600 flex items-center gap-1">
                                        Görüntüle <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                {sub.proofData && (
                                    <div className="col-span-full mt-2 pt-2 border-t border-slate-200">
                                        <p className="text-xs text-slate-500">Gönderilen Kanıt:</p>
                                        <p className="text-sm italic text-slate-700">{sub.proofData}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Section */}
                            {sub.status === 'approved' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                        <p className="text-sm text-blue-800 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Admin başvurunuzu onayladı! Lütfen görevi tamamlayıp kanıtınızı aşağıya girin.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ekran görüntüsü linki veya kullanıcı adınız..."
                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            value={proofInput[sub.id] || ""}
                                            onChange={(e) => setProofInput({ ...proofInput, [sub.id]: e.target.value })}
                                        />
                                        <Button
                                            onClick={() => handleSubmitProof(sub.id)}
                                            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Gönder
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {sub.status === 'pending' && (
                                <p className="text-sm text-amber-600 italic">
                                    * Admin onayı bekleniyor. Onaylandıktan sonra kanıt yükleyebileceksiniz.
                                </p>
                            )}

                            {sub.status === 'submitted' && (
                                <p className="text-sm text-purple-600 italic">
                                    * Kanıtınız inceleniyor. Görev veren kişi onayladıktan sonra bakiye hesabınıza yansıyacaktır.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
