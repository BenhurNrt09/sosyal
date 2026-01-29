"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { signIn, checkResetEmail, updatePassword } from "../../actions/auth";
import { Eye, EyeOff, Loader2, AlertCircle, Activity, CheckCircle2 } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";

type AuthStage = 'login' | 'forgot-email' | 'reset-password' | 'success';

export default function LoginPage() {
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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-orange-100 shadow-xl shadow-orange-50/50">
                <CardHeader className="space-y-1 pb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200/50 transform hover:scale-110 transition-transform duration-300">
                            <Activity className="w-10 h-10" strokeWidth={3} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-center text-slate-900 uppercase">
                        {stage === 'login' ? 'HOŞ GELDİNİZ' :
                            stage === 'forgot-email' ? 'Şifre Sıfırla' :
                                stage === 'reset-password' ? 'Yeni Şifre' :
                                    'BAŞARILI!'}
                    </CardTitle>
                    <CardDescription className="text-center font-medium">
                        {stage === 'login' && 'Görev vermek ve yönetmek için giriş yapın'}
                        {stage === 'forgot-email' && 'E-posta adresinizi girerek devam edin'}
                        {stage === 'reset-password' && 'Hesabınız için yeni bir şifre belirleyin'}
                        {stage === 'success' && 'Şifreniz güncellendi. Giriş ekranına dönülüyor...'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {stage === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <p className="text-emerald-700 font-bold">İŞLEM BAŞARILI!</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {stage === 'login' && (
                                <form action={handleLoginSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="ornek@site.com" className="rounded-xl border-slate-200 focus:ring-orange-500 h-12" required disabled={isPending} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" title="password icon" className="font-bold text-slate-700">Şifre</Label>
                                            <button
                                                type="button"
                                                onClick={() => setStage('forgot-email')}
                                                className="text-xs text-orange-600 hover:text-orange-700 font-bold"
                                            >
                                                Şifremi unuttum?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                className="rounded-xl border-slate-200 focus:ring-orange-500 h-12 pr-10"
                                                required
                                                disabled={isPending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                                title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                                                disabled={isPending}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                            disabled={isPending}
                                        />
                                        <Label htmlFor="rememberMe" className="text-sm font-medium text-slate-700 cursor-pointer">
                                            Beni hatırla
                                        </Label>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl h-12 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email" className="font-bold text-slate-700 uppercase text-xs">Kayıtlı E-posta</Label>
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ornek@site.com"
                                            className="rounded-xl border-slate-200 focus:ring-orange-500 h-12"
                                            required
                                            disabled={isPending}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3 pt-2">
                                        <Button
                                            onClick={handleCheckEmail}
                                            disabled={isPending}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl h-12"
                                        >
                                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "DEVAM ET"}
                                        </Button>
                                        <button
                                            onClick={() => setStage('login')}
                                            className="text-xs font-bold text-slate-500 hover:text-slate-700 text-center"
                                        >
                                            İPTAL ET VE GERİ DÖN
                                        </button>
                                    </div>
                                </div>
                            )}

                            {stage === 'reset-password' && (
                                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 uppercase text-xs">Yenİ Şİfre</Label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="rounded-xl border-slate-200 focus:ring-orange-500 h-12 pr-10"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 uppercase text-xs">Şİfre Tekrar</Label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="rounded-xl border-slate-200 focus:ring-orange-500 h-12 pr-10"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleResetPassword}
                                        disabled={isPending || !newPassword || newPassword !== confirmPassword}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl h-12 shadow-lg shadow-orange-100"
                                    >
                                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "ŞİFREYİ GÜNCELLE"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center border-t border-slate-50 pt-6">
                    <div className="text-sm text-slate-500 font-medium">
                        {stage === 'login' ? (
                            <>Hesabın yok mu? <Link href="/register" className="text-orange-600 hover:text-orange-700 font-black">Kayıt Ol</Link></>
                        ) : (
                            <button onClick={() => setStage('login')} className="hover:text-slate-700 font-bold">Giriş Ekranına Dön</button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
