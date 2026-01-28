import { getTaskById } from "@/actions/tasks";
import { submitProof } from "@/actions/submissions";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea } from "@repo/ui";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Placeholder for Input/Textarea if not exists, we use standard html elements or creates them.
// I will create simple components inline or assume standard HTML for speed if UI package update is too much context switch, 
// BUT for quality I should update UI package. I'll stick to standard HTML for form elements for this specific step 
// to ensure it works then refactor, OR I can just use basic styling classes.

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
    const task = await getTaskById(params.id);

    if (!task) {
        return <div>Görev bulunamadı.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Görev Detayı</h2>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                    {task.platform}
                </span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                    <CardDescription>
                        Kalan Kota: {task.remaining_quantity} / {task.total_quantity}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-slate-50 p-4 text-slate-700">
                        {task.description}
                    </div>

                    <div className="flex items-center gap-2 font-bold text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Kazanacağın Tutar: {task.price_per_action}₺
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Kanıt Gönder</CardTitle>
                    <CardDescription>Görevi tamamladıktan sonra kanıtlarını buradan ilet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={submitProof} className="space-y-4">
                        <input type="hidden" name="taskId" value={task.id} />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kanıt Linki / Açıklama</label>
                            <input
                                name="proofText"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ekran Görüntüsü (Opsiyonel)</label>
                            {/* File upload currently just takes text URL for MVP simplification as we didn't setup storage bucket logic yet */}
                            <input
                                name="proofUrl"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Resim linki (örn: hizliresim.com/...)"
                            />
                            <p className="text-xs text-slate-400">* Dosya yükleme özelliği yakında aktif olacak.</p>
                        </div>

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            Kanıtı Gönder ve Onaya Sun
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
