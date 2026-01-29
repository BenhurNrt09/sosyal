"use client";

import Link from "next/link";

export default function DashboardSelect() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl">
                            <span className="text-3xl font-bold text-white">S</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Hoş Geldiniz!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Hangi panele gitmek istersiniz?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Görev Ver Card */}
                    <Link href="http://localhost:3000" className="group">
                        <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-100 hover:border-violet-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/50">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                        Görev Ver
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Sosyal medya hesaplarınız için görev oluşturun,
                                        etkileşim kazanın ve kitlenizi büyütün.
                                    </p>
                                </div>
                                <div className="w-full pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-violet-600 font-semibold group-hover:gap-4 transition-all">
                                        <span>Panel'e Git</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Görev Al Card */}
                    <Link href="http://localhost:3001" className="group">
                        <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-100 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/50">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                        Görev Al
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Görevleri tamamlayın, kazancınızı artırın ve
                                        hızlıca para kazanmaya başlayın.
                                    </p>
                                </div>
                                <div className="w-full pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
                                        <span>Panel'e Git</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
