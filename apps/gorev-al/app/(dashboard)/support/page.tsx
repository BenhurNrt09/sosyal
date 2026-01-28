"use client";

import { MessageCircle, Mail, Phone, Clock, HelpCircle } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
import { Input } from "@repo/ui/src/components/ui/input";
import { Label } from "@repo/ui/src/components/ui/label";
import { useState } from "react";
import { submitSupportTicket } from "@/actions/support";

export default function SupportPage() {
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("Diğer");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("category", category);
        formData.append("subject", subject);
        formData.append("message", message);

        const result = await submitSupportTicket(formData);

        setIsSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setMessage("");
            setSubject("");
            setCategory("Diğer");
            setTimeout(() => setSuccess(false), 5000);
        }
    };

    return (
        <div className="space-y-6">
            {/* ... other code unchanged ... */}
            {/* Header and Grid sections omitted for brevity in replacement, but I will target the form area */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Destek Talebi Oluştur</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-bold text-slate-700 mb-2">Kategori</Label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium bg-white"
                                required
                            >
                                <option value="Teknik">Teknik Sorun</option>
                                <option value="Ödeme">Ödeme & Bakiye</option>
                                <option value="Görev">Görev İşlemleri</option>
                                <option value="Reklam">Reklam & İşbirliği</option>
                                <option value="Diğer">Diğer</option>
                            </select>
                        </div>
                        <div>
                            <Label className="text-sm font-bold text-slate-700 mb-2">Konu Başlığı</Label>
                            <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Talebinizi özetleyen kısa bir başlık"
                                className="h-12"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-slate-700 mb-2">Mesajınız</Label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium resize-none"
                            rows={6}
                            placeholder="Sorununuzu detaylı olarak açıklayın..."
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold h-12"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gönderiliyor...
                            </>
                        ) : (
                            "Gönder"
                        )}
                    </Button>
                </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-violet-600" />
                    <h2 className="text-2xl font-black text-slate-900">Sık Sorulan Sorular</h2>
                </div>

                <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-4">
                        <h3 className="font-bold text-slate-900 mb-2">Para çekme işlemi ne kadar sürer?</h3>
                        <p className="text-slate-600 text-sm">Para çekme talepiniz onaylandıktan sonra 1-3 iş günü içinde hesabınıza aktarılır.</p>
                    </div>

                    <div className="border-b border-slate-100 pb-4">
                        <h3 className="font-bold text-slate-900 mb-2">Görevlerim neden reddedildi?</h3>
                        <p className="text-slate-600 text-sm">Görev reddedilme sebepleri kanıt fotoğraflarının eksik veya hatalı olması, görev kurallarına uyulmaması olabilir. Detaylı bilgi için bildirimleri kontrol edin.</p>
                    </div>

                    <div className="border-b border-slate-100 pb-4">
                        <h3 className="font-bold text-slate-900 mb-2">Şifremi unuttum, ne yapmalıyım?</h3>
                        <p className="text-slate-600 text-sm">Giriş sayfasında "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama linki gönderebilirsiniz.</p>
                    </div>

                    <div className="pb-4">
                        <h3 className="font-bold text-slate-900 mb-2">Hesabımı nasıl silebilirim?</h3>
                        <p className="text-slate-600 text-sm">Hesap silme işlemi için destek ekibimizle iletişime geçmeniz gerekmektedir. E-posta veya telefon ile bize ulaşabilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
