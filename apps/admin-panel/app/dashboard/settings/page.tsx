"use client";
import { useState } from "react";
import { Settings as SettingsIcon, Save, Globe, Bell, Shield, Palette, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@repo/ui";
import { useTheme } from "../../../context/theme-context";
import { updateAdminPassword, updateSiteSettings } from "@/actions/settings";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [taskApprovals, setTaskApprovals] = useState(false);

    // Form states
    const [siteName, setSiteName] = useState("Sosyal Görev Platformu");
    const [siteDesc, setSiteDesc] = useState("En güvenilir görev platformu");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Loading states
    const [savingSettings, setSavingSettings] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    // Feedback states
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        setStatus(null);
        const result = await updateSiteSettings({ siteName, siteDesc }) as { success: boolean, message?: string, error?: string };
        if (result.success) {
            setStatus({ type: 'success', message: result.message || "Ayarlar kaydedildi." });
        } else {
            setStatus({ type: 'error', message: result.error || "Hata oluştu." });
        }
        setSavingSettings(false);
    };

    const handleUpdatePassword = async () => {
        if (!newPassword) return setStatus({ type: 'error', message: "Yeni şifre boş olamaz." });
        setUpdatingPassword(true);
        setStatus(null);
        const result = await updateAdminPassword(currentPassword, newPassword) as { success: boolean, message?: string, error?: string };
        if (result.success) {
            setStatus({ type: 'success', message: result.message || "Şifre güncellendi." });
            setCurrentPassword("");
            setNewPassword("");
        } else {
            setStatus({ type: 'error', message: result.error || "Hata oluştu." });
        }
        setUpdatingPassword(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Ayarlar</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">Platform ayarlarını yapılandırın</p>
                </div>
                <Button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-200 py-6 px-8 rounded-2xl font-black gap-2 uppercase tracking-tight"
                >
                    {savingSettings ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="h-5 w-5" />}
                    Kaydet
                </Button>
            </div>

            {status && (
                <div className={`p-4 rounded-xl border font-bold text-sm ${status.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                    {status.message}
                </div>
            )}

            <div className="grid gap-6">
                {/* Genel Ayarlar */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <Globe className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Genel Ayarlar</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="site-name" className="text-slate-700 dark:text-slate-300">Site Adı</Label>
                            <Input
                                id="site-name"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="Platform Adı"
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:placeholder:text-slate-600 h-12 rounded-xl"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="site-desc" className="text-slate-700 dark:text-slate-300">Site Açıklaması</Label>
                            <Input
                                id="site-desc"
                                value={siteDesc}
                                onChange={(e) => setSiteDesc(e.target.value)}
                                placeholder="Platform açıklaması"
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:placeholder:text-slate-600 h-12 rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Bildirim Ayarları */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400">
                            <Bell className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bildirim Ayarları</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-200">Email Bildirimleri</p>
                                <p className="text-sm text-slate-500">Yeni kullanıcı kaydı bildirimlerini al</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-cyan-600' : 'bg-slate-700'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-200">Görev Onayları</p>
                                <p className="text-sm text-slate-500">Bekleyen görev onaylarını bildir</p>
                            </div>
                            <button
                                onClick={() => setTaskApprovals(!taskApprovals)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${taskApprovals ? 'bg-cyan-600' : 'bg-slate-700'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${taskApprovals ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Güvenlik Ayarları */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Güvenlik</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password" className="text-slate-700 dark:text-slate-300">Mevcut Şifre</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 h-12 rounded-xl"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password" className="text-slate-700 dark:text-slate-300">Yeni Şifre</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 h-12 rounded-xl"
                            />
                        </div>
                        <Button
                            onClick={handleUpdatePassword}
                            disabled={updatingPassword}
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white h-12 rounded-xl font-bold gap-2 uppercase"
                        >
                            {updatingPassword && <Loader2 className="animate-spin w-4 h-4" />}
                            Şifreyi Güncelle
                        </Button>
                    </div>
                </div>

                {/* Görünüm Ayarları */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            <Palette className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Görünüm</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-200">Koyu Mod</p>
                                <p className="text-sm text-slate-500">Karanlık tema kullan</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-cyan-600' : 'bg-slate-700'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
