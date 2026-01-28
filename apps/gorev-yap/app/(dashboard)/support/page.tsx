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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
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
            setTimeout(() => setSuccess(false), 5000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-[2rem] p-8 text-white shadow-lg shadow-orange-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black">Destek Merkezi</h1>
                        <p className="text-orange-50 font-medium">Size nasıl yardımcı olabiliriz?</p>
                    </div>
                </div>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {error}
                </div>
            )}

            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-slate-900 mb-2">E-posta</h3>
                    <p className="text-sm text-slate-500 mb-3 font-medium">7/24 destek için bize yazın</p>
                    <a href="mailto:destek@dh.com" className="text-orange-600 font-black text-sm hover:underline">
                        destek@dh.com
                    </a>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                        <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-slate-900 mb-2">Telefon</h3>
                    <p className="text-sm text-slate-500 mb-3 font-medium">Mesai saatleri içinde arayın</p>
                    <a href="tel:+905551234567" className="text-orange-600 font-black text-sm hover:underline">
                        +90 555 123 45 67
                    </a>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-slate-900 mb-2">Çalışma Saatleri</h3>
                    <p className="text-sm text-slate-500 mb-1 font-medium">Pazartesi - Cuma</p>
                    <p className="text-orange-600 font-black text-sm">09:00 - 18:00</p>
                </div>
            </div>

            {/* Support Form */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Destek Talebi Oluştur</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label className="text-sm font-bold text-slate-700 mb-2">Konu</Label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                            required
                        >
                            <option value="">Konu Seçin</option>
                            <option value="account">Hesap İşlemleri</option>
                            <option value="payment">Ödeme & Bakiye</option>
                            <option value="task">Görev İşlemleri</option>
                            <option value="technical">Teknik Sorun</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-slate-700 mb-2">Mesajınız</Label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none"
                            rows={6}
                            placeholder="Sorununuzu detaylı olarak açıklayın..."
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg shadow-orange-100 rounded-xl font-bold h-12"
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
                    <HelpCircle className="w-6 h-6 text-orange-600" />
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
