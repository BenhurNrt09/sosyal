"use client";

import { useState, useEffect } from "react";
import { getSubmissionsForCreator, updateSubmissionStatus, subscribeToTasks, Submission } from "@repo/lib";
import { createClient } from "@repo/lib/src/supabase";
import { Check, X, Eye, User, FileText, Clock, AlertCircle } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

export default function ReviewSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

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
            // Only show submitted tasks for creator review
            setSubmissions(data.filter(s => s.status === 'submitted' || s.status === 'creator_approved'));
        }
        setLoading(false);
    };

    const handleAction = async (id: string, status: Submission['status']) => {
        const success = await updateSubmissionStatus(id, status);
        if (success) {
            loadSubmissions();
        } else {
            alert("İşlem sırasında hata oluştu.");
        }
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
                <p className="text-slate-500">Görevlerinizi yapan kişilerin gönderdiği kanıtları onaylayın.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                {submissions.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Şu an incelenecek kanıt bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-4 px-4 text-slate-500 font-bold text-sm uppercase">Kullanıcı</th>
                                    <th className="text-left py-4 px-4 text-slate-500 font-bold text-sm uppercase">Görev</th>
                                    <th className="text-left py-4 px-4 text-slate-500 font-bold text-sm uppercase">Kanıt</th>
                                    <th className="text-left py-4 px-4 text-slate-500 font-bold text-sm uppercase">Durum</th>
                                    <th className="text-right py-4 px-4 text-slate-500 font-bold text-sm uppercase">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <span className="font-bold text-slate-700">{sub.user?.username || "Anonim"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-medium text-slate-600">
                                                {sub.task?.platformName} - {sub.task?.taskTypeName}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <a href={sub.proofData} target="_blank" className="text-orange-600 hover:underline flex items-center gap-1 text-sm font-bold">
                                                Kanıtı Gör <Eye className="w-3 h-3" />
                                            </a>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-black ${sub.status === 'submitted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {sub.status === 'submitted' ? 'Bekliyor' : 'Onayladınız'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {sub.status === 'submitted' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleAction(sub.id, 'creator_approved')}
                                                        className="h-8 w-8 p-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAction(sub.id, 'rejected')}
                                                        className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-lg"
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
        </div>
    );
}
