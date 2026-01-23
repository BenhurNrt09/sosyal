export default function NotificationsPage() {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-wide">BİLDİRİM YOK</h2>
            <p className="text-slate-400 text-sm font-bold tracking-wider uppercase">HENÜZ BİR BİLDİRİM ALMADINIZ.</p>
        </div>
    );
}
