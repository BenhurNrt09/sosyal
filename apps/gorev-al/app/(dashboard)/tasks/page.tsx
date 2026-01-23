"use client";

import { Button } from "@repo/ui/src/components/ui/button";

export default function TasksPage() {
    return (
        <div>
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">GÖREV BULUNAMADI</h2>
                <p className="text-slate-500 mb-8 max-w-md">Bu kategoride henüz bir göreviniz yok. Yeni görevler keşfetmeye ne dersiniz?</p>
                <Button className="bg-slate-900 text-white rounded-xl px-8 py-6 font-bold hover:bg-slate-800">
                    YENİ GÖREVLERİ GÖR
                </Button>
            </div>
        </div>
    );
}
