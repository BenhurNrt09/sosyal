"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Save } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
import { Input } from "@repo/ui/src/components/ui/input";
import { Label } from "@repo/ui/src/components/ui/label";
import { getProfile, updateProfile } from "@/actions/profile";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        deviceType: "" as "android" | "iphone" | "",
        instagram: "",
        tiktok: "",
        twitter: "",
        youtube: "",
    });

    // Fetch user data from Supabase
    useEffect(() => {
        async function loadProfile() {
            const result = await getProfile() as any;
            if (result.error) {
                setError(result.error);
            } else if (result.profile) {
                const p = result.profile as any;
                setProfileData({
                    name: p.name || "",
                    email: p.email || "",
                    phone: p.phone || "",
                    deviceType: p.device_type || "",
                    instagram: p.instagram_username || "",
                    tiktok: p.tiktok_username || "",
                    twitter: p.twitter_username || "",
                    youtube: p.youtube_username || "",
                });
            }
        }
        loadProfile();
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);
            setSuccess(null);

            const formData = new FormData();
            formData.append("name", profileData.name);
            formData.append("phone", profileData.phone);
            formData.append("deviceType", profileData.deviceType);
            formData.append("instagram", profileData.instagram);
            formData.append("tiktok", profileData.tiktok);
            formData.append("twitter", profileData.twitter);
            formData.append("youtube", profileData.youtube);

            const result = await updateProfile(formData);

            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Profil başarıyla güncellendi!");
                setIsEditing(false);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error("Profile save error:", err);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    {error}
                </div>
            )}

            {/* Personal Info */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">KİŞİSEL BİLGİLER</h2>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                            Düzenle
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-bold text-slate-400 uppercase mb-2">Ad Soyad</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-orange-500"
                                    placeholder="Ad Soyad"
                                />
                            ) : (
                                <p className="font-bold text-slate-900 p-4 bg-slate-50 rounded-xl">{profileData.name}</p>
                            )}
                        </div>
                        <div>
                            <Label className="text-xs font-bold text-slate-400 uppercase mb-2">E-posta</Label>
                            <p className="font-bold text-slate-900 p-4 bg-slate-50 rounded-xl">{profileData.email}</p>
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs font-bold text-slate-400 uppercase mb-2">Telefon Numarası</Label>
                        {isEditing ? (
                            <Input
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="rounded-xl border-slate-200 focus:ring-violet-500"
                                placeholder="05XX XXX XX XX"
                            />
                        ) : (
                            <p className="font-bold text-slate-900 p-4 bg-slate-50 rounded-xl">
                                {profileData.phone || "Girilmedi"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Social Media Accounts */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">
                    SOSYAL HESAPLAR (OPSİYONEL)
                </h2>

                <div className="space-y-4">
                    {/* Instagram */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-pink-50 text-pink-400 rounded-xl flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase mb-1">INSTAGRAM</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.instagram}
                                    onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-orange-500"
                                    placeholder="@kullaniciadi"
                                />
                            ) : (
                                <p className="text-sm font-medium text-slate-900">
                                    {profileData.instagram || "Bağlı değil"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* TikTok */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase mb-1">TIKTOK</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.tiktok}
                                    onChange={(e) => setProfileData({ ...profileData, tiktok: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-orange-500"
                                    placeholder="@kullaniciadi"
                                />
                            ) : (
                                <p className="text-sm font-medium text-slate-900">
                                    {profileData.tiktok || "Bağlı değil"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Twitter */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-50 text-sky-400 rounded-xl flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase mb-1">TWITTER (X)</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.twitter}
                                    onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-orange-500"
                                    placeholder="@kullaniciadi"
                                />
                            ) : (
                                <p className="text-sm font-medium text-slate-900">
                                    {profileData.twitter || "Bağlı değil"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* YouTube */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-400 rounded-xl flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase mb-1">YOUTUBE</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.youtube}
                                    onChange={(e) => setProfileData({ ...profileData, youtube: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-orange-500"
                                    placeholder="@kanaladi"
                                />
                            ) : (
                                <p className="text-sm font-medium text-slate-900">
                                    {profileData.youtube || "Bağlı değil"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Device Type Selection */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">CİHAZ TİPİ</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <button
                        type="button"
                        onClick={() => isEditing && setProfileData({ ...profileData, deviceType: "android" })}
                        disabled={!isEditing}
                        className={`border rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${profileData.deviceType === "android"
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-100 hover:border-orange-200 hover:bg-orange-50/50"
                            } ${!isEditing ? "cursor-default opacity-75" : "cursor-pointer"}`}
                    >
                        <div className={`mb-3 transition-colors ${profileData.deviceType === "android" ? "text-orange-600" : "text-slate-300"
                            }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                        </div>
                        <span className={`font-bold transition-colors ${profileData.deviceType === "android" ? "text-orange-600" : "text-slate-400"
                            }`}>ANDROID</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => isEditing && setProfileData({ ...profileData, deviceType: "iphone" })}
                        disabled={!isEditing}
                        className={`border rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${profileData.deviceType === "iphone"
                            ? "border-orange-500 bg-orange-50"
                            : "border-slate-100 hover:border-orange-200 hover:bg-orange-50/50"
                            } ${!isEditing ? "cursor-default opacity-75" : "cursor-pointer"}`}
                    >
                        <div className={`mb-3 transition-colors ${profileData.deviceType === "iphone" ? "text-orange-600" : "text-slate-300"
                            }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>
                        </div>
                        <span className={`font-bold transition-colors ${profileData.deviceType === "iphone" ? "text-orange-600" : "text-slate-400"
                            }`}>IPHONE</span>
                    </button>
                </div>
            </div>

            {/* Save Button */}
            {isEditing && (
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-100/50"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Support Center */}
            <Link href="/support">
                <div className="bg-slate-900 rounded-[2rem] p-8 shadow-lg flex items-center justify-between text-white overflow-hidden relative group cursor-pointer hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-900/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
                        </div>
                        <div>
                            <h3 className="font-black text-lg">DESTEK MERKEZİ</h3>
                            <p className="text-xs text-orange-400 font-bold tracking-wide">HESAP İŞLEMLERİ & YARDIM</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                </div>
            </Link>
        </div>
    );
}
