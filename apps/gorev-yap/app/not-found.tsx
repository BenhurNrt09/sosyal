import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
            <div className="text-center">
                <h1 className="text-9xl font-black text-orange-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Sayfa Bulunamadı</h2>
                <p className="text-lg text-slate-600 mb-8">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                    Anasayfaya Dön
                </Link>
            </div>
        </div>
    );
}
