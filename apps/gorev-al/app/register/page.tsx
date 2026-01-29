"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUp } from "../../actions/auth";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await signUp(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setIsSuccess(true);
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 sm:p-10">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>

            <Card className="w-full max-w-md border-none shadow-2xl shadow-violet-200/40 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="pt-12 pb-6 px-10 text-center relative border-none">
                    {/* Rounded Cutout for Logo Area */}
                    <div className="flex justify-center mb-8 relative">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-xl border border-slate-50 dark:border-slate-800 -rotate-3 group hover:rotate-0 transition-transform duration-500">
                            <img src="/logo-parala.jpg" alt="Parala" className="w-full h-full object-contain rounded-xl" />
                        </div>
                    </div>
                    <CardTitle className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Kayıt Ol</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                        Hemen üye ol ve kazanmaya başla
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-10 pb-10">
                    {isSuccess ? (
                        <div className="space-y-6 py-4 px-2">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-8 py-10 rounded-[2.5rem] text-center space-y-4 animate-in fade-in zoom-in duration-500 shadow-inner">
                                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                    <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-xl font-black uppercase tracking-tight">Kayıt Başarılı!</p>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Geleceğin kazananları arasına katıldınız.</p>
                            </div>
                            <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-2xl h-16 shadow-xl shadow-violet-200/50 transition-all active:scale-[0.98] uppercase tracking-widest text-xs border-none">
                                <Link href="/login">GİRİŞ YAPARAK BAŞLA</Link>
                            </Button>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-4 rounded-[1.5rem] flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">AD SOYAD</Label>
                                    <Input id="fullName" name="fullName" placeholder="Ali Yılmaz" className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-xs font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner" required disabled={isPending} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">KULLANICI ADI</Label>
                                    <Input id="username" name="username" placeholder="ali_ylmz" className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-xs font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner" required disabled={isPending} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">E-POSTA</Label>
                                <Input id="email" name="email" type="email" placeholder="ornek@site.com" className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-xs font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner" required disabled={isPending} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="password label" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">ŞİFRE</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-xs font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner pr-12"
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
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirm" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">ŞİFRE ONAY</Label>
                                <div className="relative">
                                    <Input
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none text-xs font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner pr-12"
                                        required
                                        disabled={isPending}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        title={showPasswordConfirm ? "Şifreyi Gizle" : "Şifreyi Göster"}
                                        disabled={isPending}
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-2xl h-16 shadow-xl shadow-violet-200/50 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-xs border-none mt-4"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Kayıt Yapılıyor...
                                    </>
                                ) : (
                                    "Kayıt Ol"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
                {!isSuccess && (
                    <CardFooter className="flex justify-center bg-slate-50/50 dark:bg-slate-900/50 py-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Zaten hesabın var mı?{" "}
                            <Link href="/" className="text-violet-600 hover:text-violet-700 font-black ml-1">
                                Giriş Yap
                            </Link>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
