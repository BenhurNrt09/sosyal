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
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl shadow-violet-200/30">
                <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black mb-1">Destek Merkezi</h1>
                        <p className="text-violet-100 font-semibold text-lg">Size nasıl yardımcı olabiliriz?</p>
                    </div>
                </div>
            </div>

            {success && (
                <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-6 py-5 rounded-2xl flex items-center gap-4 font-semibold animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                    </div>
                    <div>Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-5 rounded-2xl flex items-center gap-4 font-semibold animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    </div>
                    <div>{error}</div>
                </div>
            )}

            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-8 border-2 border-violet-100 hover:shadow-xl hover:border-violet-200 transition-all group">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center text-violet-600 mb-5 group-hover:scale-110 transition-transform shadow-md">
                        <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-2">E-posta</h3>
                    <p className="text-sm text-slate-500 mb-4 font-semibold leading-relaxed">7/24 destek için bize yazın</p>
                    <a href="mailto:destek@parala.com" className="text-violet-600 font-black text-sm hover:underline inline-flex items-center gap-1">
                        destek@parala.com
                    </a>
                </div>

                <div className="bg-white rounded-3xl p-8 border-2 border-violet-100 hover:shadow-xl hover:border-violet-200 transition-all group">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center text-violet-600 mb-5 group-hover:scale-110 transition-transform shadow-md">
                        <Phone className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-2">Telefon</h3>
                    <p className="text-sm text-slate-500 mb-4 font-semibold leading-relaxed">Mesai saatleri içinde arayın</p>
                    <a href="tel:+905559876543" className="text-violet-600 font-black text-sm hover:underline inline-flex items-center gap-1">
                        +90 555 987 65 43
                    </a>
                </div>

                <div className="bg-white rounded-3xl p-8 border-2 border-violet-100 hover:shadow-xl hover:border-violet-200 transition-all group">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center text-violet-600 mb-5 group-hover:scale-110 transition-transform shadow-md">
                        <Clock className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-2">Çalışma Saatleri</h3>
                    <p className="text-sm text-slate-500 mb-2 font-semibold">Pazartesi - Cuma</p>
                    <p className="text-violet-600 font-black text-base">09:00 - 18:00</p>
                </div>
            </div>
            <div className="bg-white rounded-3xl p-10 border-2 border-violet-100 shadow-lg">
                <h2 className="text-3xl font-black text-slate-900 mb-8">Destek Talebi Oluştur</h2>
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
