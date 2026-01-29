"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard,
    Building2,
    Plus,
    ArrowUpRight,
    Wallet,
    Loader2,
    History,
    ChevronDown,
    CheckCircle2,
    ShieldCheck,
    Smartphone,
    CreditCard as CardIcon
} from "lucide-react";
import { Button, Card, CardContent } from "@repo/ui";
import { CreditCard3D } from "./credit-card-3d";
import { WithdrawalDialog } from "./withdrawal-dialog";
import { cn } from "@repo/ui/src/lib/utils";

const BANKS = [
    { id: 'akbank', name: 'Akbank', color: 'bg-red-600', textColor: 'text-white' },
    { id: 'garanti', name: 'Garanti BBVA', color: 'bg-emerald-600', textColor: 'text-white' },
    { id: 'isbank', name: 'İş Bankası', color: 'bg-blue-800', textColor: 'text-white' },
    { id: 'yapikredi', name: 'Yapı Kredi', color: 'bg-cyan-600', textColor: 'text-white' },
    { id: 'ziraat', name: 'Ziraat Bankası', color: 'bg-red-700', textColor: 'text-white' },
    { id: 'halkbank', name: 'Halkbank', color: 'bg-blue-600', textColor: 'text-white' },
    { id: 'vakifbank', name: 'Vakıfbank', color: 'bg-amber-500', textColor: 'text-white' },
    { id: 'qnb', name: 'QNB Finansbank', color: 'bg-sky-700', textColor: 'text-white' },
    { id: 'denizbank', name: 'Denizbank', color: 'bg-blue-900', textColor: 'text-white' },
    { id: 'papara', name: 'Papara', color: 'bg-black', textColor: 'text-white' }
];

export default function WalletPage() {
    const [selectedBank, setSelectedBank] = useState(BANKS[0]);
    const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
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
        const value = e.target.value.replace(/\D/g, "").substring(0, 16);
        setCardData({ ...cardData, number: value });
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").substring(0, 4);
        setCardData({ ...cardData, expiry: value });
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").substring(0, 3);
        setCardData({ ...cardData, cvv: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Payment submitted:", { bank: selectedBank.name, amount, cardData });
        alert("Simülasyon: Ödeme başarıyla alındı!");
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
        <div className="space-y-10 pb-12 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Cüzdanım</h1>
                    <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-sm">Kazançlarınızı yönetin ve çekim talebi oluşturun</p>
                </div>
            </div>

            {/* main Balance Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="h-full bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600 rounded-[3rem] p-12 text-white shadow-[0_30px_60px_-15px_rgba(124,58,237,0.3)] dark:shadow-none relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                        <div className="absolute -left-20 -bottom-10 w-80 h-80 bg-black/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-[10px] font-black text-white/70 mb-3 uppercase tracking-[0.3em]">MEVCUT BAKİYE</p>
                                <h2 className="text-7xl font-black tracking-tighter leading-none mb-4 text-white drop-shadow-2xl flex items-baseline gap-2">
                                    <span className="text-3xl opacity-50 font-medium tracking-normal">₺</span>
                                    {balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-10">
                                <Button
                                    onClick={() => setIsWithdrawing(true)}
                                    className="h-16 px-10 bg-white hover:bg-slate-50 text-violet-600 font-extrabold rounded-[1.5rem] flex-1 shadow-2xl uppercase tracking-widest text-[11px] transition-all active:scale-95 border-none"
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-3" strokeWidth={3} />
                                    KAZANCI ÇEK
                                </Button>
                                <Button
                                    onClick={() => {
                                        const paymentForm = document.getElementById('payment-form');
                                        paymentForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="h-16 px-10 bg-white/15 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 font-extrabold rounded-[1.5rem] flex-1 uppercase tracking-widest text-[11px] transition-all active:scale-95"
                                >
                                    <Plus className="w-5 h-5 mr-3" />
                                    BAKİYE YÜKLE
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex-1 group hover:border-violet-200 transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GÜVENLİK</p>
                                    <p className="text-xs font-black text-emerald-500 uppercase mt-1">SSL AKTİF</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">256-Bit Şifreleme</p>
                            <p className="text-xs text-slate-500 mt-1">Tüm ödemeleriniz banka düzeyinde güvenlik ile korunur.</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex-1 group hover:border-violet-200 transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Smartphone className="w-7 h-7" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3D SECURE</p>
                                    <p className="text-xs font-black text-blue-500 uppercase mt-1">ZORUNLU</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Mobil Onay</p>
                            <p className="text-xs text-slate-500 mt-1">Ödeme sırasında telefonunuza gelen kod ile doğrulama yapılır.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modern POS Interface */}
            <div id="payment-form" className="grid lg:grid-cols-5 gap-10 scroll-mt-20">
                <div className="lg:col-span-3">
                    <Card className="rounded-[3.5rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                            <CardIcon className="w-64 h-64" />
                        </div>

                        <CardContent className="p-12 lg:p-16">
                            <div className="flex items-center gap-4 mb-14">
                                <div className="w-2 h-10 bg-violet-600 rounded-full" />
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">SANAL POS</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Ödeme ve Bakiye Yükleme Sayfası</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Amount Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">YÜKLENECEK TUTAR</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[100, 250, 500, 1000].map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => setAmount(v.toString())}
                                                className={cn(
                                                    "h-14 rounded-2xl border-2 font-black text-sm transition-all",
                                                    amount === v.toString()
                                                        ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                                                        : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-violet-200"
                                                )}
                                            >
                                                {v}₺
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-violet-600">₺</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full h-20 pl-14 pr-8 rounded-[1.8rem] bg-slate-50 dark:bg-slate-800/40 border-none text-2xl font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all shadow-inner"
                                            placeholder="Özel tutar girin..."
                                        />
                                    </div>
                                </div>

                                {/* Bank Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">BANKA SEÇİMİ</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsBankMenuOpen(!isBankMenuOpen)}
                                            className="w-full h-16 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between border-2 border-transparent hover:border-violet-200 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-10 h-6 rounded flex items-center justify-center text-[8px] font-black uppercase", selectedBank.color, selectedBank.textColor)}>
                                                    BANK
                                                </div>
                                                <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedBank.name}</span>
                                            </div>
                                            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", isBankMenuOpen && "rotate-180")} />
                                        </button>

                                        <AnimatePresence>
                                            {isBankMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute z-50 left-0 right-0 top-full mt-3 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-3 grid grid-cols-2 gap-2"
                                                >
                                                    {BANKS.map((bank) => (
                                                        <button
                                                            key={bank.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedBank(bank);
                                                                setIsBankMenuOpen(false);
                                                            }}
                                                            className={cn(
                                                                "h-14 px-4 rounded-2xl flex items-center gap-3 transition-all",
                                                                selectedBank.id === bank.id
                                                                    ? "bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800"
                                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                            )}
                                                        >
                                                            <div className={cn("w-8 h-5 rounded flex items-center justify-center text-[7px] font-black uppercase shrink-0", bank.color, bank.textColor)}>
                                                                {bank.id.substring(0, 3)}
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase truncate">{bank.name}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">KART BİLGİLERİ</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cardData.number}
                                                onChange={handleCardNumberChange}
                                                className="w-full h-16 px-6 pt-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-mono tracking-[0.3em] font-black text-lg text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                                                placeholder="0000 0000 0000 0000"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={cardData.name}
                                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                        className="w-full h-16 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none uppercase font-black text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                        placeholder="KART ÜZERİNDEKİ İSİM"
                                    />

                                    <div className="grid grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            value={cardData.expiry}
                                            onChange={handleExpiryChange}
                                            className="h-16 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-black text-center tracking-widest text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                            placeholder="MM / YY"
                                        />
                                        <input
                                            type="text"
                                            value={cardData.cvv}
                                            onChange={handleCvvChange}
                                            onFocus={() => setIsCvvFocused(true)}
                                            onBlur={() => setIsCvvFocused(false)}
                                            className="h-16 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-none font-black text-center tracking-widest text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10"
                                            placeholder="CVV / CVC"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-20 bg-gradient-to-r from-indigo-700 via-violet-600 to-fuchsia-600 hover:scale-[1.02] active:scale-[0.98] text-white rounded-[1.8rem] text-lg font-black mt-8 shadow-[0_20px_40px_-10px_rgba(124,58,237,0.4)] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4"
                                >
                                    <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                                    ÖDEMEYİ ONAYLA
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <div className="hidden lg:block sticky top-20">
                        <div className="p-12 lg:p-14 bg-slate-50/50 dark:bg-slate-950/20 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-10">
                            <CreditCard3D data={cardData} isFlipped={isCvvFocused} />

                            <div className="text-center space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">GÜVENLİ İŞLEM KARTI</p>
                                <div className="flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase">EV SSL SECURED</span>
                                </div>
                            </div>
                        </div>

                        <Card className="mt-10 rounded-[3rem] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                            <CardContent className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">SON İŞLEMLER</h3>
                                    <History className="w-6 h-6 text-slate-200" />
                                </div>
                                <div className="flex flex-col items-center justify-center text-center py-10 opacity-40">
                                    <History className="w-12 h-12 text-slate-300 mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Henüz bir işlem yok</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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
