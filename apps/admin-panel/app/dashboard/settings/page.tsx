"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Save, Globe, Bell, Shield, Palette } from "lucide-react";
import { Button, Input, Label } from "@repo/ui";
import { useTheme } from "../../../context/theme-context";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [taskApprovals, setTaskApprovals] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ayarlar</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Platform ayarlarını yapılandırın</p>
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700">
                    <Save className="mr-2 h-4 w-4" />
                    Kaydet
                </Button>
            </div>

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
                                placeholder="Platform Adı"
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="site-desc" className="text-slate-700 dark:text-slate-300">Site Açıklaması</Label>
                            <Input
                                id="site-desc"
                                placeholder="Platform açıklaması"
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Bildirim Ayarları */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
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
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-indigo-600' : 'bg-slate-700'
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
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${taskApprovals ? 'bg-indigo-600' : 'bg-slate-700'
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
                                className="border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password" className="text-slate-700 dark:text-slate-300">Yeni Şifre</Label>
                            <Input
                                id="new-password"
                                type="password"
                                className="border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
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
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-700'
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
