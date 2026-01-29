"use client";

import { useState, useEffect } from "react";
import { CreditCard, Building2, Plus, ArrowUpRight, Wallet, Loader2, ArrowRightCircle, Target, TrendingUp, History, Clock } from "lucide-react";
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
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kazanç Verileri Alınıyor</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Cüzdanım</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">Kazançlarınızı yönetin ve çekim talebi oluşturun</p>
                </div>
            </div>

            {/* main Balance Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="h-full bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-violet-200/50 dark:shadow-none relative overflow-hidden group">
                        {/* Decorative Blur Elements */}
                        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                        <div className="absolute -left-20 -bottom-10 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-14">
                                <div>
                                    <p className="text-[10px] font-black text-white/70 mb-2 uppercase tracking-[0.2em]">TOPLAM KAZANÇ</p>
                                    <h2 className="text-6xl font-black tracking-tighter leading-none mb-2 text-white drop-shadow-lg">
                                        ₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </h2>
                                </div>
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                                    <Wallet className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                                <Button
                                    onClick={() => setIsWithdrawing(true)}
                                    className="h-16 px-10 bg-white hover:bg-slate-50 text-violet-600 font-black rounded-2xl flex-1 shadow-2xl uppercase tracking-widest text-[11px] transition-all active:scale-95 border-none"
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-3" strokeWidth={3} />
                                    KAZANCI ÇEK
                                </Button>
                                <Button
                                    onClick={() => {
                                        const paymentForm = document.getElementById('payment-form');
                                        paymentForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="h-16 px-10 bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white border border-white/20 font-black rounded-2xl flex-1 uppercase tracking-widest text-[11px] transition-all active:scale-95"
                                >
                                    <Plus className="w-5 h-5 mr-3" />
                                    BAKİYE YÜKLE
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden flex-1">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BU AY</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">₺0.00</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-600 w-1/4 rounded-full" />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hedef kazancın %0'ı</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm overflow-hidden flex-1">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MİN. ÇEKİM</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">₺100.00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment & History Section */}
            <div id="payment-form" className="grid lg:grid-cols-2 gap-10 scroll-mt-10">
                <div className="space-y-10">
                    <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm">
                        <CardContent className="p-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-3">BAKİYE YÜKLE</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-10">GÖREV OLUŞTURMAK İÇİN BAKİYE EKLEYİN</p>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">YÜKLENECEK MİKTAR (₺)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-violet-600">₺</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full h-20 pl-14 pr-8 rounded-[1.8rem] bg-slate-50 dark:bg-slate-800/40 border-none text-2xl font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("credit")}
                                        className={`h-24 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "credit"
                                            ? "border-violet-600 bg-violet-50/50 dark:bg-violet-600/10"
                                            : "border-slate-50 dark:border-slate-800 hover:border-violet-200"
                                            }`}
                                    >
                                        <CreditCard className={`w-6 h-6 ${paymentMethod === "credit" ? "text-violet-600" : "text-slate-300"}`} />
                                        <span className={`text-[10px] font-black tracking-widest uppercase ${paymentMethod === "credit" ? "text-violet-600" : "text-slate-400"}`}>KREDİ KARTI</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("bank")}
                                        className={`h-24 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "bank"
                                            ? "border-violet-600 bg-violet-50/50 dark:bg-violet-600/10"
                                            : "border-slate-50 dark:border-slate-800 hover:border-violet-200"
                                            }`}
                                    >
                                        <Building2 className={`w-6 h-6 ${paymentMethod === "bank" ? "text-violet-600" : "text-slate-300"}`} />
                                        <span className={`text-[10px] font-black tracking-widest uppercase ${paymentMethod === "bank" ? "text-violet-600" : "text-slate-400"}`}>BANKA KARTI</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <input
                                        type="text"
                                        value={cardData.number}
                                        onChange={handleCardNumberChange}
                                        maxLength={16}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-mono text-center tracking-[0.25em] font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                        placeholder="KART NUMARASI"
                                    />
                                    <input
                                        type="text"
                                        value={cardData.name}
                                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none uppercase font-black text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                        placeholder="AD SOYAD"
                                    />
                                    <div className="grid grid-cols-2 gap-5">
                                        <input
                                            type="text"
                                            value={cardData.expiry}
                                            onChange={handleExpiryChange}
                                            maxLength={4}
                                            className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-black text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                            placeholder="MM/YY"
                                        />
                                        <input
                                            type="text"
                                            value={cardData.cvv}
                                            onChange={handleCvvChange}
                                            onFocus={() => setIsCvvFocused(true)}
                                            onBlur={() => setIsCvvFocused(false)}
                                            maxLength={3}
                                            className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-black text-center text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                            placeholder="CVV"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-16 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-[1.2rem] font-black mt-4 shadow-xl shadow-violet-200/50 uppercase tracking-widest text-xs active:scale-[0.98] transition-all"
                                    >
                                        ÖDEMEYİ TAMAMLA
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-10">
                    <div className="p-10 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-8">
                        <CreditCard3D data={cardData} isFlipped={isCvvFocused} />
                    </div>

                    <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-sm flex-1">
                        <CardContent className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">İŞLEM GEÇMİŞİ</h3>
                                <History className="w-6 h-6 text-slate-300" />
                            </div>
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <History className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-6" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Henüz bir işlem kaydı bulunmuyor.</p>
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
