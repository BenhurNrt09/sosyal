"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add authentication logic here
        // For now, redirect to dashboard selector
        router.push("/dashboard-select");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50/30 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-200/20 to-transparent blur-3xl"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-violet-100/20 to-transparent blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-violet-500/10 p-10 border border-violet-100/50">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
                            <Check className="w-8 h-8 text-white" strokeWidth={3} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
                        HOŞ GELDİNİZ
                    </h1>
                    <p className="text-center text-slate-600 mb-8">
                        Hesabınıza giriş yapın
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide">
                                E-Posta Adresi
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ornek@email.com"
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:outline-none bg-white/50 backdrop-blur transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide">
                                Şifre
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:outline-none bg-white/50 backdrop-blur transition-all text-slate-900 placeholder:text-slate-400 font-medium pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.rememberMe ? 'bg-violet-600 border-violet-600' : 'border-gray-300 group-hover:border-violet-400'}`}>
                                    {formData.rememberMe && <Check size={14} className="text-white" strokeWidth={3} />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="hidden"
                                />
                                <span className="text-slate-700 font-semibold group-hover:text-violet-700 transition-colors">Beni Hatırla</span>
                            </label>
                            <Link href="/forgot-password" className="text-violet-600 font-bold hover:text-violet-700 transition-colors">
                                Şifremi Unuttum
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6"
                        >
                            GİRİŞ YAP
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-600 text-sm font-medium">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-violet-600 font-bold hover:text-violet-700 transition-colors underline decoration-2 underline-offset-2">
                                Ücretsiz Kayıt Ol
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-slate-400 text-sm hover:text-slate-600 transition-colors font-medium">
                            ← Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
