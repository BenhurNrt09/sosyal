"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardHeader } from "@repo/ui";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate network delay for a smoother feel
        await new Promise(resolve => setTimeout(resolve, 800));

        if (formData.username.trim() === "admin" && formData.password.trim() === "admin123") {
            // Set a simple cookie to simulate session
            document.cookie = "admin_auth=true; path=/";
            router.push("/dashboard");
        } else {
            setError("Kullanıcı adı veya şifre hatalı");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
            {/* Ambient Background Effects */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/50 blur-[80px]" />

            <Card className="relative z-10 w-full max-w-[400px] border-slate-800/50 bg-slate-900/60 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-cyan-500/10 hover:border-slate-700/50">
                <CardHeader className="space-y-6 pb-6 pt-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Admin Girişi
                        </h1>
                        <p className="text-sm text-slate-400">
                            Yönetici paneline erişim
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            <div className="group relative">
                                <Label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-cyan-400">
                                    Kullanıcı Adı
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-cyan-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Kullanıcı adınızı girin"
                                        className="h-11 border-slate-800 bg-slate-950/50 pl-10 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-cyan-500/20"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="group relative">
                                <Label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-cyan-400">
                                    Şifre
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-cyan-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-11 border-slate-800 bg-slate-950/50 pl-10 pr-10 text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-cyan-500/20"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                            />
                            <Label htmlFor="rememberMe" className="text-sm font-medium text-slate-300 cursor-pointer">
                                Beni hatırla
                            </Label>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-inset ring-red-500/20 animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="group h-11 w-full bg-gradient-to-r from-cyan-600 to-cyan-500 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-cyan-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Giriş Yapılıyor...
                                </>
                            ) : (
                                <>
                                    Giriş Yap
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="absolute bottom-6 text-center text-xs text-slate-600">
                <p>&copy; 2024 Admin Panel. Tüm hakları saklıdır.</p>
            </div>
        </div>
    );
}
