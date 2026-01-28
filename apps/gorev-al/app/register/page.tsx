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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-violet-100 shadow-xl shadow-violet-50/50">
                <CardHeader className="space-y-1 pb-8">
                    <div className="flex justify-center mb-4">
                        <img src="/logo-parala.jpg" alt="Parala" className="h-16 w-auto" />
                    </div>
                    <CardTitle className="text-3xl font-black text-center text-slate-900">Kayıt Ol</CardTitle>
                    <CardDescription className="text-center font-medium">
                        Hemen üye ol ve kazanmaya başla
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSuccess ? (
                        <div className="space-y-6 py-4">
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-8 rounded-2xl text-center space-y-3 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <p className="text-lg font-bold">Kayıt yapıldı!</p>
                                <p className="text-sm font-medium opacity-90">Lütfen giriş yaparak devam edin.</p>
                            </div>
                            <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl h-12 shadow-lg shadow-violet-100 transition-all active:scale-[0.98]">
                                <Link href="/login">Giriş Yap</Link>
                            </Button>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="font-bold text-slate-700">Ad Soyad</Label>
                                    <Input id="fullName" name="fullName" placeholder="Ad Soyad" className="rounded-xl border-slate-200 focus:ring-violet-500 h-11" required disabled={isPending} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="font-bold text-slate-700">Kullanıcı Adı</Label>
                                    <Input id="username" name="username" placeholder="kullaniciadi" className="rounded-xl border-slate-200 focus:ring-violet-500 h-11" required disabled={isPending} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="ornek@site.com" className="rounded-xl border-slate-200 focus:ring-violet-500 h-11" required disabled={isPending} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" title="password label" className="font-bold text-slate-700">Şifre</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className="rounded-xl border-slate-200 focus:ring-violet-500 h-11 pr-10"
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
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirm" className="font-bold text-slate-700">Şifre Doğrula</Label>
                                <div className="relative">
                                    <Input
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        className="rounded-xl border-slate-200 focus:ring-violet-500 h-11 pr-10"
                                        required
                                        disabled={isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
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
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl h-12 shadow-lg shadow-violet-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                    <CardFooter className="flex justify-center border-t border-slate-50 pt-6">
                        <div className="text-sm text-slate-500 font-medium">
                            Zaten hesabın var mı?{" "}
                            <Link href="/login" className="text-violet-600 hover:text-violet-700 font-black">
                                Giriş Yap
                            </Link>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
