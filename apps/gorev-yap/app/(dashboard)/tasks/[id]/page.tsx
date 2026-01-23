import { getTaskWithSubmissions } from "../../../actions/management";
import { reviewSubmission } from "../../../actions/review";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { CheckCircle2, XCircle, ExternalLink, Clock } from "lucide-react";

export default async function TaskManagementPage({ params }: { params: { id: string } }) {
    const data = await getTaskWithSubmissions(params.id);

    if (!data) {
        return <div>Görev bulunamadı veya yetkiniz yok.</div>;
    }

    const { task, submissions } = data;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Görev Yönetimi</h2>
                    <p className="text-slate-500">{task.title}</p>
                </div>
                <div className="flex gap-4 items-center bg-white border px-4 py-2 rounded-lg shadow-sm">
                    <div className="flex flex-col items-center border-r pr-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase">Toplam</span>
                        <span className="font-bold text-lg">{task.total_quantity}</span>
                    </div>
                    <div className="flex flex-col items-center border-r pr-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase">Kalan</span>
                        <span className="font-bold text-lg text-orange-600">{task.remaining_quantity}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-semibold uppercase">Onaylanan</span>
                        <span className="font-bold text-lg text-green-600">
                            {task.total_quantity - task.remaining_quantity}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Gelen Kanıtlar ({submissions.length})</h3>

                {submissions.length === 0 ? (
                    <div className="p-12 text-center border-dashed border-2 rounded-xl text-slate-400 bg-slate-50">
                        Henüz hiç kanıt gönderilmemiş.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {submissions.map((sub: any) => (
                            <Card key={sub.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row items-center border-l-4 border-l-orange-500">
                                    <div className="p-6 flex-1 w-full">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                    {sub.profiles?.username?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{sub.profiles?.username || "Kullanıcı"}</p>
                                                    <p className="text-xs text-slate-400">{new Date(sub.created_at).toLocaleString('tr-TR')}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 flex items-center gap-1">
                                                {sub.status === 'pending' && <span className="text-orange-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Bekliyor</span>}
                                                {sub.status === 'approved' && <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Onaylandı</span>}
                                                {sub.status === 'rejected' && <span className="text-red-600 flex items-center gap-1"><XCircle className="w-3 h-3" /> Reddedildi</span>}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-md text-sm mb-2 break-all border">
                                            <p className="font-medium text-slate-700 mb-1">Kanıt Metni/Linki:</p>
                                            <a href={sub.proof_text} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                {sub.proof_text} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        {sub.proof_url && (
                                            <div className="text-sm">
                                                <span className="font-medium text-slate-700">Ek Dosya: </span>
                                                <a href={sub.proof_url} target="_blank" className="text-blue-600 underline">Görüntüle</a>
                                            </div>
                                        )}
                                    </div>

                                    {sub.status === 'pending' && (
                                        <div className="p-6 bg-slate-50 md:border-l md:w-48 w-full flex flex-col gap-2">
                                            <form action={reviewSubmission}>
                                                <input type="hidden" name="submissionId" value={sub.id} />
                                                <input type="hidden" name="taskId" value={task.id} />
                                                <input type="hidden" name="decision" value="approve" />
                                                <Button type="submit" size="sm" className="w-full bg-green-600 hover:bg-green-700 gap-2">
                                                    <CheckCircle2 className="w-4 h-4" /> Onayla
                                                </Button>
                                            </form>
                                            <form action={reviewSubmission}>
                                                <input type="hidden" name="submissionId" value={sub.id} />
                                                <input type="hidden" name="taskId" value={task.id} />
                                                <input type="hidden" name="decision" value="reject" />
                                                <Button type="submit" size="sm" variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 gap-2">
                                                    <XCircle className="w-4 h-4" /> Reddet
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
