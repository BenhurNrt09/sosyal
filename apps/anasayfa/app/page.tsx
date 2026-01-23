"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, Check, Star, Users, Shield, Zap, Menu, X } from "lucide-react";

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
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Check className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">SOSYAL</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              <a href="#nasil-calisir" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">
                Nasıl Çalışır?
              </a>
              <a href="#hizmetler" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">
                Hizmetler
              </a>
              <a href="#avantajlar" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">
                Avantajlar
              </a>
              <a href="#sss" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">
                S.S.S
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-violet-600 transition-colors border border-transparent hover:bg-violet-50 rounded-full"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-7 py-2.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Kayıt Ol
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-violet-600 transition-colors"
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
              <Link href="/register" className="w-full py-3 text-center bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/30">
                Kayıt Ol
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-violet-50 to-transparent"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-bold mb-8 border border-violet-200">
                <span className="flex h-2 w-2 rounded-full bg-violet-600"></span>
                Türkiye'nin En Aktif Görev Platformu
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                Sosyal Medya ile <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
                  Kazanmaya Başla
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Binlerce gerçek kullanıcı ile sosyal medya etkileşimlerinizi artırın veya basit görevleri tamamlayarak ek gelir elde edin. Hızlı, güvenli ve kolay.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-full transition-all shadow-lg shadow-violet-500/40 hover:shadow-violet-600/50 transform hover:-translate-y-1"
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
                  <span>Hızlı Ödeme</span>
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

            {/* Hero Image / Illustration */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-lg">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-purple-600 rounded-[3rem] rotate-3 opacity-10"></div>
                <div className="absolute inset-0 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center p-8">
                  {/* Abstract UI representation */}
                  <div className="w-full flex justify-between items-center mb-8">
                    <div className="w-24 h-6 bg-slate-100 rounded-full"></div>
                    <div className="w-10 h-10 bg-violet-100 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-violet-50 p-6 rounded-2xl">
                      <div className="w-8 h-8 bg-violet-200 rounded-lg mb-3"></div>
                      <div className="w-20 h-4 bg-violet-200 rounded-full"></div>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-2xl">
                      <div className="w-8 h-8 bg-orange-200 rounded-lg mb-3"></div>
                      <div className="w-16 h-4 bg-orange-200 rounded-full"></div>
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
                <div className="absolute -left-10 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce cursor-pointer hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Günlük</div>
                      <div className="text-sm font-bold text-slate-900">+150 TL</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-5 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce delay-150 cursor-pointer hover:scale-105 transition-transform" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Aktif Üye</div>
                      <div className="text-sm font-bold text-slate-900">12.5K+</div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 top-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce delay-300 cursor-pointer hover:scale-105 transition-transform" style={{ animationDuration: '4s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Star className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Memnuniyet</div>
                      <div className="text-sm font-bold text-slate-900">4.9/5</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-5 bottom-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce delay-75 cursor-pointer hover:scale-105 transition-transform" style={{ animationDuration: '3.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-semibold uppercase">Güvenli</div>
                      <div className="text-sm font-bold text-slate-900">%100</div>
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
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgb(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1 transform">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>50K+</div>
              <div className="text-sm text-slate-400 font-semibold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Tamamlanan Görev</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgb(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1 transform">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>12K+</div>
              <div className="text-sm text-slate-400 font-semibold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Aktif Kullanıcı</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgb(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1 transform">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>₺250K+</div>
              <div className="text-sm text-slate-400 font-semibold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Ödenen Tutar</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-center border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgb(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1 transform">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>4.9/5</div>
              <div className="text-sm text-slate-400 font-semibold tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Kullanıcı Puanı</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="nasil-calisir" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-violet-600 font-bold tracking-wide uppercase text-sm">Kolay ve Hızlı</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Nasıl Çalışır?</h2>
            <p className="text-lg text-slate-600">Sadece 3 adımda kazanmaya veya büyümeye başlayın. Karmaşık işlemler yok, her şey çok net.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-violet-200 to-transparent -z-10"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-violet-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-violet-100 group-hover:border-violet-500 group-hover:scale-110 transition-all duration-300">
                <span className="text-3xl font-bold text-violet-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Ücretsiz Kayıt Ol</h3>
              <p className="text-slate-600 leading-relaxed">
                Sadece telefon ve e-posta adresinle saniyeler içinde hesabını oluştur. Kart bilgisi gerekmez.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-violet-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-violet-100 group-hover:border-violet-500 group-hover:scale-110 transition-all duration-300">
                <span className="text-3xl font-bold text-violet-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Görev Seç & Yap</h3>
              <p className="text-slate-600 leading-relaxed">
                Panelindeki yüzlerce görevden dilediğini seç, talimatları uygula ve kanıtını gönder.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-violet-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-violet-100 group-hover:border-violet-500 group-hover:scale-110 transition-all duration-300">
                <span className="text-3xl font-bold text-violet-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Kazancını Çek</h3>
              <p className="text-slate-600 leading-relaxed">
                Onaylanan görevlerden bakiyen biriksin. Limitine ulaşınca anında banka hesabına çek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Services */}
      <section id="hizmetler" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Güvenli Ödeme</h3>
              <p className="text-slate-600">Ödemeleriniz güvence altında. Her hafta düzenli olarak ödemeleriniz hesabınıza yatırılır.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gerçek Kullanıcılar</h3>
              <p className="text-slate-600">Bot yok, sahte hesap yok. Tüm etkileşimler %100 gerçek ve onaylı kullanıcılardan gelir.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hızlı Görev Onayı</h3>
              <p className="text-slate-600">Gönderdiğiniz kanıtlar ekibimiz tarafından en geç 24 saat içinde incelenir ve onaylanır.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Üyelik</h3>
              <p className="text-slate-600">Premium üye olarak görevlerden daha fazla kazanç elde edebilir ve öncelikli destek alabilirsiniz.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Menu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gelişmiş Panel</h3>
              <p className="text-slate-600">Kullanıcı dostu panelimiz ile tüm işlemlerinizi kolayca takip edin, raporları inceleyin.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Uygun Fiyatlar</h3>
              <p className="text-slate-600">Görev verenler için piyasanın en uygun fiyatları ile en yüksek kalitede hizmet sunuyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-40"></div>

        {/* 3D Card Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-12 md:p-16 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent rounded-2xl"></div>

            <div className="relative text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                Kazanmaya Başlamak İçin <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300">
                  Daha Fazla Bekleme
                </span>
              </h2>
              <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Binlerce mutlu kullanıcımızın arasına katılın. İster görev yapın kazanın, ister görev verin büyüyün.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  href="/register"
                  className="px-10 py-5 bg-white text-violet-900 font-black rounded-xl hover:bg-violet-50 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] hover:scale-105 transform"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Ücretsiz Hesap Oluştur
                </Link>
                <Link
                  href="/login"
                  className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all shadow-lg"
                  style={{ fontFamily: 'Inter, sans-serif' }}
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
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <span className="text-2xl font-bold text-white">SOSYAL</span>
              </div>
              <p className="leading-relaxed max-w-md">Türkiye'nin en gelişmiş sosyal medya görev platformu. Güvenilir altyapısı ve geniş kullanıcı kitlesi ile hizmetinizde.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Hızlı Menü</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-violet-400 transition-colors">Ana Sayfa</a></li>
                <li><a href="#hizmetler" className="hover:text-violet-400 transition-colors">Hizmetler</a></li>
                <li><a href="#nasil-calisir" className="hover:text-violet-400 transition-colors">Nasıl Çalışır?</a></li>
                <li><a href="/login" className="hover:text-violet-400 transition-colors">Giriş Yap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Yasal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-violet-400 transition-colors">Kullanım Koşulları</a></li>
                <li><a href="#" className="hover:text-violet-400 transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-violet-400 transition-colors">Çerez Politikası</a></li>
                <li><a href="#" className="hover:text-violet-400 transition-colors">İletişim</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; 2026 SOSYAL. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
