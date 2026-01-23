"use client";

import { Plus } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">SOSYAL HESAPLAR</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-50 text-pink-400 rounded-xl flex items-center justify-center opacity-70">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">INSTAGRAM</p>
                                <p className="text-sm font-medium text-slate-400">Hesap bağlı değil</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full gap-2 border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-200">
                            <Plus size={16} /> Ekle
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center opacity-70">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">TIKTOK</p>
                                <p className="text-sm font-medium text-slate-400">Hesap bağlı değil</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full gap-2 border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-200">
                            <Plus size={16} /> Ekle
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <div className="border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                    <div className="text-slate-300 group-hover:text-violet-400 mb-3 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                    </div>
                    <span className="font-bold text-slate-400 group-hover:text-violet-600 transition-colors">ANDROID</span>
                </div>
                <div className="border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                    <div className="text-slate-300 group-hover:text-violet-400 mb-3 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>
                    </div>
                    <span className="font-bold text-slate-400 group-hover:text-violet-600 transition-colors">IPHONE</span>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-lg flex items-center justify-between text-white overflow-hidden relative group cursor-pointer">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
                    </div>
                    <div>
                        <h3 className="font-black text-lg">DESTEK MERKEZİ</h3>
                        <p className="text-xs text-slate-400 font-bold tracking-wide">HESAP İŞLEMLERİ & YARDIM</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </div>
            </div>
        </div>
    );
}
