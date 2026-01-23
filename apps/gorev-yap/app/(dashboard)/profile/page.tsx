"use client";

import { Button } from "@repo/ui/src/components/ui/button";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">HESAP BİLGİLERİ</h2>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Ad Soyad</p>
                            <p className="font-bold text-slate-900">Kullanıcı</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">E-posta</p>
                            <p className="font-bold text-slate-900">user@example.com</p>
                        </div>
                    </div>
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
