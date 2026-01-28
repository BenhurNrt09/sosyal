"use client";

import { Button } from "@repo/ui";
import { FileSearch } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mb-8 animate-bounce">
                <FileSearch size={48} />
            </div>
            <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
            <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase">SAYFA BULUNAMADI</h2>
            <p className="text-slate-500 max-w-md mb-8 font-medium">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                Lütfen adresi kontrol edin veya geri dönün.
            </p>
            <Button
                onClick={() => window.history.back()}
                className="bg-orange-600 hover:bg-orange-700 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-[0.95]"
            >
                GERİ DÖN
            </Button>
        </div>
    );
}
