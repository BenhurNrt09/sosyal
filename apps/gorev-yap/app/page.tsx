"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, Check, Star, Users, Shield, Zap, Menu, X, Activity } from "lucide-react";

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <Activity className="w-7 h-7 text-white" strokeWidth={3} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">DİJİTAL HAVUZ</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-10">
                            <a href="#nasil-calisir" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">
                                Nasıl Çalışır?
                            </a>
                            <a href="#hizmetler" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">
                                Hizmetler
                            </a>
                            <a href="#avantajlar" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">
                                Avantajlar
                            </a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/login"
                                className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors border border-transparent hover:bg-orange-50 rounded-full"
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                href="/register"
                                className="px-7 py-2.5 text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Kayıt Ol
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-orange-600 transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl md:hidden p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                        <a href="#nasil-calisir" className="text-base font-semibold text-slate-600 py-2">
                            Nasıl Çalışır?
                        </a>
                        <a href="#hizmetler" className="text-base font-semibold text-slate-600 py-2">
                            Hizmetler
                        </a>
                        <div className="flex flex-col gap-3 mt-2">
                            <Link href="/login" className="w-full py-3 text-center border border-gray-200 rounded-xl font-bold text-slate-700">
                                Giriş Yap
                            </Link>
                            <Link href="/register" className="w-full py-3 text-center bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30">
                                Kayıt Ol
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent"></div>
                <div className="absolute top-20 right-20 w-96 h-96 bg-orange-200/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 text-orange-700 text-sm font-bold mb-8 border border-orange-200">
                                <span className="flex h-2 w-2 rounded-full bg-orange-600"></span>
                                Türkiye'nin En Güvenilir Görev Platformu
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                                Görev Ver, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600">
                                    Büyü!
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                Sosyal medya hesaplarınızı büyütmek mi istiyorsunuz? Binlerce gerçek kullanıcı ile etkileşimlerinizi artırın, hedefinize hızlıca ulaşın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full transition-all shadow-lg shadow-orange-500/40 hover:shadow-orange-600/50 transform hover:-translate-y-1"
                                >
                                    Hemen Başla
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-full transition-all hover:border-slate-300"
                                >
                                    Giriş Yap
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Hızlı Teslimat</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>7/24 Destek</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>Güvenli Altyapı</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Illustration */}
                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            <div className="relative w-full aspect-square max-w-lg">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-600 rounded-[3rem] rotate-3 opacity-10"></div>
                                <div className="absolute inset-0 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center p-8">
                                    <div className="w-full flex justify-between items-center mb-8">
                                        <div className="w-24 h-6 bg-slate-100 rounded-full"></div>
                                        <div className="w-10 h-10 bg-orange-100 rounded-full"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                        <div className="bg-orange-50 p-6 rounded-2xl">
                                            <div className="w-8 h-8 bg-orange-200 rounded-lg mb-3"></div>
                                            <div className="w-20 h-4 bg-orange-200 rounded-full"></div>
                                        </div>
                                        <div className="bg-amber-50 p-6 rounded-2xl">
                                            <div className="w-8 h-8 bg-amber-200 rounded-lg mb-3"></div>
                                            <div className="w-16 h-4 bg-amber-200 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-4">
                                        <div className="w-full h-20 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="w-32 h-4 bg-slate-200 rounded-full"></div>
                                                <div className="w-20 h-3 bg-slate-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-full h-20 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="w-24 h-4 bg-slate-200 rounded-full"></div>
                                                <div className="w-16 h-3 bg-slate-100 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -left-10 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold uppercase">Aktif Görev</div>
                                            <div className="text-sm font-bold text-slate-900">1.250+</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -right-5 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce delay-150" style={{ animationDuration: '3s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-semibold uppercase">Kullanıcı</div>
                                            <div className="text-sm font-bold text-slate-900">12.5K+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 hover:scale-105 transition-transform">
                            <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">50K+</div>
                            <div className="text-sm text-slate-400 font-semibold">Tamamlanan Görev</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 hover:scale-105 transition-transform">
                            <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">12K+</div>
                            <div className="text-sm text-slate-400 font-semibold">Aktif Kullanıcı</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 hover:scale-105 transition-transform">
                            <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">₺500K+</div>
                            <div className="text-sm text-slate-400 font-semibold">İşlem Hacmi</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 hover:scale-105 transition-transform">
                            <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">4.9/5</div>
                            <div className="text-sm text-slate-400 font-semibold">Kullanıcı Puanı</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="nasil-calisir" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-orange-600 font-bold tracking-wide uppercase text-sm">Kolay ve Hızlı</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Nasıl Çalışır?</h2>
                        <p className="text-lg text-slate-600">Sadece 3 adımda büyümeye başlayın. Karmaşık işlemler yok, her şey çok net.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-orange-100 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300">
                                <span className="text-3xl font-bold text-orange-600">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Ücretsiz Kayıt Ol</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Sadece telefon ve e-posta adresinle saniyeler içinde hesabını oluştur. Kart bilgisi gerekmez.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-orange-100 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300">
                                <span className="text-3xl font-bold text-orange-600">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Görev Oluştur</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Sosyal medya hesabınız için istediğiniz hizmeti seçin ve sipariş verin.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-orange-100 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300">
                                <span className="text-3xl font-bold text-orange-600">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Büyümeyi İzle</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Gerçek kullanıcılardan gelen etkileşimlerle hesabınızın büyümesini izleyin.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="hizmetler" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Güvenli İşlem</h3>
                            <p className="text-slate-600">Ödemeleriniz SSL sertifikası ile korunur. Verileriniz güvende.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Gerçek Kullanıcılar</h3>
                            <p className="text-slate-600">Bot yok, sahte hesap yok. Tüm etkileşimler %100 gerçek kullanıcılardan.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Hızlı Teslimat</h3>
                            <p className="text-slate-600">Siparişleriniz anında işleme alınır ve hızlıca teslim edilir.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Star className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Yüksek Kalite</h3>
                            <p className="text-slate-600">En yüksek kalitede hizmet sunarak memnuniyetinizi garanti ediyoruz.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                <Menu className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Kolay Yönetim</h3>
                            <p className="text-slate-600">Kullanıcı dostu panelimiz ile tüm işlemlerinizi kolayca yönetin.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Check className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Uygun Fiyatlar</h3>
                            <p className="text-slate-600">Piyasanın en uygun fiyatları ile en yüksek kalitede hizmet.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-orange-900 via-amber-900 to-orange-900 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500 rounded-full blur-[120px] opacity-40"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-12 md:p-16 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                                Sosyal Medyada <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-orange-300">
                                    Fark Yaratmaya Hazır Mısınız?
                                </span>
                            </h2>
                            <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto font-medium">
                                Binlerce mutlu kullanıcımızın arasına katılın. İster görev verin, ister görev yapın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <Link
                                    href="/register"
                                    className="px-10 py-5 bg-white text-orange-900 font-black rounded-xl hover:bg-orange-50 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] hover:scale-105 transform"
                                >
                                    Ücretsiz Hesap Oluştur
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all shadow-lg"
                                >
                                    Giriş Yap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-2xl font-bold text-white">DİJİTAL HAVUZ</span>
                            </div>
                            <p className="leading-relaxed max-w-md">Türkiye'nin en güvenilir sosyal medya görev platformu. Güvenilir altyapısı ve geniş kullanıcı kitlesi ile hizmetinizde.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Hızlı Menü</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Ana Sayfa</a></li>
                                <li><a href="#hizmetler" className="hover:text-orange-400 transition-colors">Hizmetler</a></li>
                                <li><a href="#nasil-calisir" className="hover:text-orange-400 transition-colors">Nasıl Çalışır?</a></li>
                                <li><a href="/login" className="hover:text-orange-400 transition-colors">Giriş Yap</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Yasal</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Kullanım Koşulları</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">Gizlilik Politikası</a></li>
                                <li><a href="#" className="hover:text-orange-400 transition-colors">İletişim</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 text-center text-sm">
                        <p>&copy; 2026 Dijital Havuz. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
