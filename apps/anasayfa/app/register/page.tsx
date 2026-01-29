"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff } from "lucide-react";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Şifreler eşleşmiyor!");
            return;
        }

        // TODO: Add registration logic here
        // For now, redirect to dashboard selector
        router.push("/dashboard-select");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50/30 flex items-center justify-center p-4 py-8">
            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-violet-500/10 p-10 border border-violet-100/50 my-4">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
                            <span className="text-2xl font-bold text-white">S</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
                        KAYIT OL
                    </h1>
                    <p className="text-center text-slate-600 mb-8">
                        Yeni hesap oluşturun
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide">
                                İsim Soyisim
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Adınız Soyadınız"
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:outline-none bg-white/50 backdrop-blur transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide">
                                E-Posta
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
                                Telefon Numarası
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+90 5XX XXX XX XX"
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
                                    minLength={6}
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

                        <div>
                            <label className="block text-sm font-bold text-violet-700 mb-2 uppercase tracking-wide">
                                Şifre Onayı
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:outline-none bg-white/50 backdrop-blur transition-all text-slate-900 placeholder:text-slate-400 font-medium pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6"
                        >
                            KAYIT OL
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600 text-sm font-medium">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-violet-600 font-bold hover:text-violet-700 transition-colors underline decoration-2 underline-offset-2">
                                Giriş Yap
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-slate-400 text-sm hover:text-slate-600 transition-colors font-medium">
                            ← Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
