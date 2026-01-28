"use client";

import { useState, useEffect } from "react";
import { CreditCard, Building2, Plus } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
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

    useEffect(() => {
        async function fetchBalance() {
            const { getDashboardStats } = await import("@/actions/dashboard");
            const stats = await getDashboardStats();
            if (!(stats as any).error) setBalance((stats as any).balance);
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
        // TODO: Process payment
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Cüzdanım</h1>
                <p className="text-slate-500">Bakiyenizi görüntüleyin ve yükleyin</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-[2rem] p-8 text-white shadow-lg">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-sm opacity-90 mb-1">Toplam Bakiye</p>
                        <h2 className="text-4xl font-black">₺{balance.toFixed(2)}</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => setIsWithdrawing(true)} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur text-white border-0">
                        Para Çek
                    </Button>
                    <Button
                        onClick={() => {
                            const paymentForm = document.getElementById('payment-form');
                            paymentForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="flex-1 bg-white hover:bg-white/90 text-violet-600 font-bold"
                    >
                        Bakiye Yükle
                    </Button>
                </div>
            </div>

            {/* Payment Form */}
            <div id="payment-form" className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Bakiye Yükle</h2>

                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Yüklenecek Miktar (₺)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-lg font-bold"
                        placeholder="0.00"
                    />
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Ödeme Yöntemi</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("credit")}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${paymentMethod === "credit"
                                ? "border-violet-500 bg-violet-50"
                                : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-900">Kredi Kartı</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("bank")}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${paymentMethod === "bank"
                                ? "border-violet-500 bg-violet-50"
                                : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-900">Banka Kartı</span>
                        </button>
                    </div>
                </div>

                {/* 3D Credit Card */}
                <div className="mb-8">
                    <CreditCard3D data={cardData} isFlipped={isCvvFocused} />
                </div>

                {/* Card Details Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kart Numarası</label>
                        <input
                            type="text"
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            maxLength={16}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent uppercase"
                            placeholder="AD SOYAD"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Son Kullanma</label>
                            <input
                                type="text"
                                value={cardData.expiry}
                                onChange={handleExpiryChange}
                                maxLength={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">CVV</label>
                            <input
                                type="text"
                                value={cardData.cvv}
                                onChange={handleCvvChange}
                                onFocus={() => setIsCvvFocused(true)}
                                onBlur={() => setIsCvvFocused(false)}
                                maxLength={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl h-12 text-base font-bold mt-6"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Bakiye Yükle
                    </Button>
                </form>
            </div>

            <WithdrawalDialog
                isOpen={isWithdrawing}
                onClose={() => setIsWithdrawing(false)}
                balance={0.00}
            />
        </div>
    );
}
