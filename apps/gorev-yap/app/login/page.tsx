"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "../../actions/auth";
import { Eye, EyeOff, Loader2, AlertCircle, Activity } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        // Add remember me value to formData
        formData.append("rememberMe", rememberMe.toString());
        startTransition(async () => {
            const result = await signIn(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md border-violet-100 shadow-xl shadow-violet-50/50">
                <CardHeader className="space-y-1 pb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200/50 transform hover:scale-110 transition-transform duration-300">
                            <Activity className="w-10 h-10" strokeWidth={3} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-center text-slate-900">Giriş Yap</CardTitle>
                    <CardDescription className="text-center font-medium">
                        Görev vermek ve yönetmek için giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="ornek@site.com" className="rounded-xl border-slate-200 focus:ring-violet-500 h-12" required disabled={isPending} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" title="password icon" className="font-bold text-slate-700">Şifre</Label>
                                <Link href="#" className="text-xs text-violet-600 hover:text-violet-700 font-bold">
                                    Şifremi unuttum?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="rounded-xl border-slate-200 focus:ring-violet-500 h-12 pr-10"
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
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                disabled={isPending}
                            />
                            <Label htmlFor="rememberMe" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Beni hatırla
                            </Label>
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl h-12 shadow-lg shadow-violet-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-50 pt-6">
                    <div className="text-sm text-slate-500 font-medium">
                        Hesabın yok mu?{" "}
                        <Link href="/register" className="text-violet-600 hover:text-violet-700 font-black">
                            Kayıt Ol
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
