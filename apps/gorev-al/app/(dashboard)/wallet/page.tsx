export default function WalletPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Mevcut Bakiye</p>
                    <h2 className="text-5xl font-black text-slate-900">0.00 <span className="text-2xl text-slate-400">₺</span></h2>
                </div>
                <div>
                    <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl py-4 shadow-lg shadow-violet-200 transition-all">
                        Para Çekme Talebi Oluştur
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Toplam Kazanç</p>
                        <h3 className="text-2xl font-black text-slate-900">₺0.00</h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">İncelemede</p>
                        <h3 className="text-2xl font-black text-violet-600">₺0.00</h3>
                    </div>
                    <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                </div>
                <p className="font-medium">henüz işlem bulunmuyor</p>
            </div>
        </div>
    );
}
