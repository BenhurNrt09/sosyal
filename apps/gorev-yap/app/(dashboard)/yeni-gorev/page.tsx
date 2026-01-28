"use client";

import { useState } from "react";
import { Instagram, Twitter, Facebook, Youtube, TrendingUp } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-orange-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-600" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-700" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-600" },
    { id: "tiktok", name: "TikTok", icon: TrendingUp, color: "from-black to-gray-800" },
];

export default function YeniGorevPage() {
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [taskData, setTaskData] = useState({
        description: "",
        accountName: "",
        price: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Task created:", { platform: selectedPlatform, ...taskData });
        // TODO: Submit to backend
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Yeni Görev Oluştur</h1>
                <p className="text-slate-500 font-medium">Sosyal medya hesaplarınız için görev oluşturun</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Platform Selection */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wide">Platform Seçin</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {platforms.map((platform) => {
                            const Icon = platform.icon;
                            return (
                                <button
                                    key={platform.id}
                                    type="button"
                                    onClick={() => setSelectedPlatform(platform.id)}
                                    className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${selectedPlatform === platform.id
                                        ? "border-orange-500 shadow-lg bg-orange-50/10"
                                        : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <div
                                        className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-3`}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">{platform.name}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Task Details */}
                {selectedPlatform && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Görev Detayları</h2>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Görev Açıklaması
                            </label>
                            <textarea
                                value={taskData.description}
                                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-medium"
                                rows={4}
                                placeholder="Görev açıklamasını yazın..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Hesap Adı / Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                value={taskData.accountName}
                                onChange={(e) => setTaskData({ ...taskData, accountName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                                placeholder="@kullaniciadi"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Görev Ücreti (₺)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={taskData.price}
                                onChange={(e) => setTaskData({ ...taskData, price: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl h-12 text-base font-black shadow-lg shadow-orange-100"
                        >
                            GÖREVİ OLUŞTUR
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
