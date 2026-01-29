"use client";

import { useState, useEffect } from "react";
import { CreditCard, Building2, Plus, ArrowUpRight, ArrowDownLeft, Wallet, Loader2, Clock } from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";
import { CreditCard3D } from "./credit-card-3d";
import { WithdrawalDialog } from "./withdrawal-dialog";

export default function WalletPage() {
    const [paymentMethod, setPaymentMethod] = useState<"credit" | "bank">("credit");
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });
    const [isCvvFocused, setIsCvvFocused] = useState(false);
    const [amount, setAmount] = useState("");
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBalance() {
            setLoading(true);
            const { getDashboardStats } = await import("@/actions/dashboard");
            const stats = await getDashboardStats();
            if (!(stats as any).error) setBalance((stats as any).balance);
            setLoading(false);
        }
        fetchBalance();
    }, []);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setCardData({ ...cardData, number: value });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setCardData({ ...cardData, expiry: value });
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").substring(0, 3);
        setCardData({ ...cardData, cvv: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Payment submitted:", { method: paymentMethod, amount, cardData });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cüzdan Bilgileri Alınıyor</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Cüzdanım</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">Finansal işlemlerinizi ve bakiyenizi yönetin</p>
                </div>
            </div>

            {/* Balance Card Container */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="h-full bg-gradient-to-br from-orange-600 to-orange-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-200/50 dark:shadow-none relative overflow-hidden group">
                        {/* Decorative Circles */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <p className="text-[10px] font-black text-white/70 mb-2 uppercase tracking-[0.2em]">KULLANILABİLİR BAKİYE</p>
                                    <h2 className="text-6xl font-black tracking-tighter leading-none mb-2 text-white drop-shadow-md">
                                        ₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </h2>
                                </div>
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                                    <Wallet className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => setIsWithdrawing(true)}
                                    className="h-16 px-8 bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white border border-white/20 font-black rounded-2xl flex-1 uppercase tracking-widest text-[11px] transition-all active:scale-95"
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-3" />
                                    PARA ÇEK
                                </Button>
                                <Button
                                    onClick={() => {
                                        const paymentForm = document.getElementById('payment-form');
                                        paymentForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="h-16 px-10 bg-white hover:bg-slate-50 text-orange-600 font-black rounded-2xl flex-1 shadow-2xl uppercase tracking-widest text-[11px] transition-all active:scale-95 border-none"
                                >
                                    <Plus className="w-5 h-5 mr-3" strokeWidth={3} />
                                    BAKİYE YÜKLE
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Info */}
                <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden">
                    <CardContent className="p-10 flex flex-col justify-between h-full">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">HIZLI İŞLEM BİLGİSİ</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-600/10 text-orange-600 flex items-center justify-center shrink-0">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Minimum Yükleme</p>
                                        <p className="text-[11px] font-medium text-slate-500">Alt limit 50.00 ₺ olarak belirlenmiştir.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Ücret Kesintisi</p>
                                        <p className="text-[11px] font-medium text-slate-500">Platform komisyonu %0 (sıfır) işlem ücreti.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Section */}
            <div id="payment-form" className="grid lg:grid-cols-2 gap-10 scroll-mt-10">
                <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm">
                    <CardContent className="p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">BAKİYE YÜKLE</h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">GÜVENLİ ÖDEME ALTYAPISI</p>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-10 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-2">YÜKLENECEK MİKTAR (₺)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-orange-600">₺</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-20 pl-12 pr-8 rounded-[1.8rem] bg-slate-50 dark:bg-slate-800/40 border-none text-2xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-10 space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-2">ÖDEME YÖNTEMİ</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("credit")}
                                    className={`h-24 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "credit"
                                        ? "border-orange-600 bg-orange-50/50 dark:bg-orange-600/10"
                                        : "border-slate-50 dark:border-slate-800 hover:border-orange-200"
                                        }`}
                                >
                                    <CreditCard className={`w-6 h-6 ${paymentMethod === "credit" ? "text-orange-600" : "text-slate-300"}`} />
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${paymentMethod === "credit" ? "text-orange-600" : "text-slate-400"}`}>KREDİ KARTI</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("bank")}
                                    className={`h-24 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "bank"
                                        ? "border-orange-600 bg-orange-50/50 dark:bg-orange-600/10"
                                        : "border-slate-50 dark:border-slate-800 hover:border-orange-200"
                                        }`}
                                >
                                    <Building2 className={`w-6 h-6 ${paymentMethod === "bank" ? "text-orange-600" : "text-slate-300"}`} />
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${paymentMethod === "bank" ? "text-orange-600" : "text-slate-400"}`}>BANKA KARTI</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">KART NUMARASI</label>
                                <input
                                    type="text"
                                    value={cardData.number}
                                    onChange={handleCardNumberChange}
                                    maxLength={16}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-mono text-center tracking-[0.3em] font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-orange-500/10"
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">KART ÜZERİNDEKİ İSİM</label>
                                <input
                                    type="text"
                                    value={cardData.name}
                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none uppercase font-black text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-orange-500/10"
                                    placeholder="ADINIZ SOYADINIZ"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">SKT</label>
                                    <input
                                        type="text"
                                        value={cardData.expiry}
                                        onChange={handleExpiryChange}
                                        maxLength={4}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-black text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-orange-500/10"
                                        placeholder="MM / YY"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">CVV</label>
                                    <input
                                        type="text"
                                        value={cardData.cvv}
                                        onChange={handleCvvChange}
                                        onFocus={() => setIsCvvFocused(true)}
                                        onBlur={() => setIsCvvFocused(false)}
                                        maxLength={3}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-black text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-orange-500/10"
                                        placeholder="000"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-20 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-[1.8rem] text-lg font-black mt-6 shadow-xl shadow-orange-200/50 uppercase tracking-[0.15em] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                            >
                                <Plus className="w-8 h-8" strokeWidth={3} />
                                GÜVENLİ ÖDEME YAP
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-10">
                    <div className="flex justify-center items-center py-10 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <CreditCard3D data={cardData} isFlipped={isCvvFocused} />
                    </div>

                    <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm flex-1">
                        <CardContent className="p-10">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">SON İŞLEMLER</h3>
                            <div className="flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-slate-200 dark:text-slate-800" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Henüz bir finansal işlem kaydı bulunmuyor.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <WithdrawalDialog
                isOpen={isWithdrawing}
                onClose={() => setIsWithdrawing(false)}
                balance={balance}
            />
        </div>
    );
}
