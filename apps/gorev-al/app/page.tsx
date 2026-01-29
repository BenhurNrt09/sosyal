"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { signIn, checkResetEmail, updatePassword } from "../actions/auth";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";

type AuthStage = 'login' | 'forgot-email' | 'reset-password' | 'success';

export default function RootLoginPage() {
    const [stage, setStage] = useState<AuthStage>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Success redirect timer
    useEffect(() => {
        if (stage === 'success') {
            const timer = setTimeout(() => {
                setStage('login');
                setError(null);
                setEmail("");
                setNewPassword("");
                setConfirmPassword("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const handleLoginSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await signIn(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    const handleCheckEmail = async () => {
        if (!email) {
            setError("Lütfen e-posta adresinizi girin.");
            return;
        }
        setError(null);
        startTransition(async () => {
            const result = await checkResetEmail(email);
            if (result.error) {
                setError(result.error);
            } else {
                setStage('reset-password');
            }
        });
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Şifreler uyuşmuyor.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setError(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", newPassword);
            const result = await updatePassword(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setStage('success');
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 relative overflow-hidden text-slate-900 border-none">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>

            <Card className="w-full max-w-md border-none shadow-2xl shadow-violet-200/40 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <div className="pt-12 pb-6 px-10 text-center relative">
                    <div className="flex justify-center mb-8 relative">
                        <div className="w-24 h-24 relative group">
                            <img src="/logo-parala.jpg" alt="Parala" className="w-full h-full object-contain rounded-full shadow-lg transition-transform duration-500 group-hover:scale-105" />
                        </div>
                    </div>
                    <CardTitle className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
                        {stage === 'login' ? 'Hoş Geldiniz' :
                            stage === 'forgot-email' ? 'Şifre Sıfırla' :
                                stage === 'reset-password' ? 'Yeni Şifre' :
                                    'Başarılı!'}
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                        {stage === 'login' && 'Kazanmaya başlamak için hesabınıza giriş yapın'}
                        {stage === 'forgot-email' && 'E-posta adresinizi girerek devam edin'}
                        {stage === 'reset-password' && 'Hesabınız için yeni bir şifre belirleyin'}
                        {stage === 'success' && 'Şifreniz güncellendi. Giriş ekranına yönlendiriliyorsunuz...'}
                    </CardDescription>
                </div>

                <CardContent className="px-10 pb-10">
                    {stage === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-sm">İŞLEM BAŞARILI</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-4 rounded-[1.5rem] flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {stage === 'login' && (
                                <form action={handleLoginSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">E-POSTA ADRESİ</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="adiniz@site.com"
                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            required
                                            disabled={isPending}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label htmlFor="password" title="password icon" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">ŞİFRE</Label>
                                            <button
                                                type="button"
                                                onClick={() => setStage('forgot-email')}
                                                className="text-[10px] font-black text-violet-600 hover:text-violet-700 uppercase tracking-widest"
                                            >
                                                Şifremi unuttum?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600 pr-12"
                                                required
                                                disabled={isPending}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                                                disabled={isPending}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-1">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-5 h-5 rounded-[0.5rem] border-slate-200 dark:border-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition-all"
                                            disabled={isPending}
                                        />
                                        <Label htmlFor="rememberMe" className="text-[11px] font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                            Beni hatırla
                                        </Label>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-2xl h-16 shadow-xl shadow-violet-200/50 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Giriş Yapılıyor...
                                            </>
                                        ) : (
                                            "Giriş Yap"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {stage === 'forgot-email' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-3">
                                        <Label htmlFor="reset-email" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">KAYITLI E-POSTA ADRESİ</Label>
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="adiniz@site.com"
                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            required
                                            disabled={isPending}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            onClick={handleCheckEmail}
                                            disabled={isPending}
                                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-2xl h-14 tracking-widest text-xs uppercase"
                                        >
                                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "DEVAM ET"}
                                        </Button>
                                        <button
                                            onClick={() => setStage('login')}
                                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                                        >
                                            GERİ DÖN
                                        </button>
                                    </div>
                                </div>
                            )}

                            {stage === 'reset-password' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YENİ ŞİFRE</Label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-sm font-bold text-slate-900 dark:text-white pr-12"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YENİ ŞİFRE TEKRAR</Label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-sm font-bold text-slate-900 dark:text-white pr-12"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleResetPassword}
                                        disabled={isPending || !newPassword || newPassword !== confirmPassword}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 tracking-widest text-xs uppercase shadow-lg shadow-emerald-200/50"
                                    >
                                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "ŞİFREYİ GÜNCELLE"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center bg-slate-50/50 dark:bg-slate-900/50 py-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {stage === 'login' ? (
                            <>Hesabın yok mu? <Link href="/register" className="text-violet-600 hover:text-violet-700 font-black ml-1">Kayıt Ol</Link></>
                        ) : (
                            <button onClick={() => setStage('login')} className="hover:text-slate-700">Giriş Ekranına Dön</button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
