import { createTask } from "@/actions/task";
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { AlertCircle } from "lucide-react";

export default function CreateTaskPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Yeni Görev Oluştur</h2>
                <p className="text-slate-500">Takipçi, beğeni veya yorum hizmeti almak için formu doldur.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={createTask as any} className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <label className="cursor-pointer">
                                    <input type="radio" name="platform" value="instagram" className="peer sr-only" required />
                                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:bg-orange-50 peer-checked:text-orange-600">
                                        <span className="font-semibold">Instagram</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="platform" value="tiktok" className="peer sr-only" required />
                                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:bg-orange-50 peer-checked:text-orange-600">
                                        <span className="font-semibold">TikTok</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="platform" value="facebook" className="peer sr-only" required />
                                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:bg-orange-50 peer-checked:text-orange-600">
                                        <span className="font-semibold">Facebook</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Görev Türü</Label>
                                <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                                    <option value="follow">Takip Et</option>
                                    <option value="like">Beğen</option>
                                    <option value="comment">Yorum Yap</option>
                                    <option value="dm">DM Gönder</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Teslimat Adedi</Label>
                                <Input type="number" name="quantity" min="1" placeholder="Örn: 100" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Adet Başı Ücret (₺)</Label>
                            <Input type="number" name="price" step="0.10" min="0.10" placeholder="0.50" required />
                            <p className="text-xs text-slate-400">Önerilen en düşük ücret: 0.25₺</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Görev Başlığı</Label>
                            <Input name="title" placeholder="Örn: Son gönderimi beğen" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama / Link</Label>
                            <Textarea name="description" placeholder="Görev detayları ve link..." required />
                        </div>

                        <div className="rounded-lg bg-orange-50 p-4 border border-orange-100">
                            <div className="flex items-center gap-2 mb-2 text-orange-800 font-semibold">
                                <AlertCircle className="h-5 w-5" />
                                Bilgilendirme
                            </div>
                            <p className="text-sm text-orange-700">
                                Görev oluşturduğunuzda toplam tutar bakiyenizden düşülecektir. İşlem tamamlandığında otomatik onay sürecine girer.
                            </p>
                        </div>

                        <Button type="submit" size="lg" className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg">
                            Görevi Yayınla
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
