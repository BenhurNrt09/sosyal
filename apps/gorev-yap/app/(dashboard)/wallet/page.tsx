"use client";

import { useState } from "react";
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
                <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">CÜZDANIM</h1>
                <p className="text-slate-500 font-medium">Bakiyenizi görüntüleyin ve yükleyin</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-[2rem] p-8 text-white shadow-lg shadow-orange-200">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-sm opacity-90 mb-1 font-bold uppercase tracking-wider">Toplam Bakiye</p>
                        <h2 className="text-4xl font-black">0.00₺</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <CreditCard className="w-6 h-6" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => setIsWithdrawing(true)} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur text-white border-0 font-bold h-12 rounded-xl">
                        PARA ÇEK
                    </Button>
                    <Button className="flex-1 bg-white hover:bg-slate-50 text-orange-600 font-black h-12 rounded-xl shadow-md">
                        BAKİYE YÜKLE
                    </Button>
                </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wide">BAKİYE YÜKLE</h2>

                {/* Amount Input */}
                <div className="mb-6">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Yüklenecek Miktar (₺)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-bold"
                        placeholder="0.00"
                    />
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Ödeme Yöntemi</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("credit")}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${paymentMethod === "credit"
                                ? "border-orange-500 bg-orange-50/10"
                                : "border-slate-50 hover:border-slate-200"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${paymentMethod === "credit" ? "bg-orange-100 text-orange-600" : "bg-slate-50 text-slate-400"}`}>
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className={`font-bold ${paymentMethod === "credit" ? "text-slate-900" : "text-slate-500"}`}>Kredi Kartı</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("bank")}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${paymentMethod === "bank"
                                ? "border-orange-500 bg-orange-50/10"
                                : "border-slate-50 hover:border-slate-200"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${paymentMethod === "bank" ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400"}`}>
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span className={`font-bold ${paymentMethod === "bank" ? "text-slate-900" : "text-slate-500"}`}>Banka Kartı</span>
                        </button>
                    </div>
                </div>

                {/* 3D Credit Card */}
                <div className="mb-8 flex justify-center">
                    <CreditCard3D data={cardData} isFlipped={isCvvFocused} />
                </div>

                {/* Card Details Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Kart Numarası</label>
                        <input
                            type="text"
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            maxLength={16}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-center tracking-[0.2em]"
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Ad Soyad</label>
                        <input
                            type="text"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase font-medium"
                            placeholder="KART ÜZERİNDEKİ İSİM"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Son Kullanma</label>
                            <input
                                type="text"
                                value={cardData.expiry}
                                onChange={handleExpiryChange}
                                maxLength={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-center"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">CVV</label>
                            <input
                                type="text"
                                value={cardData.cvv}
                                onChange={handleCvvChange}
                                onFocus={() => setIsCvvFocused(true)}
                                onBlur={() => setIsCvvFocused(false)}
                                maxLength={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-center"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-2xl h-14 text-lg font-black mt-6 shadow-xl shadow-orange-200 active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-6 h-6 mr-2" strokeWidth={3} />
                        BAKİYE YÜKLE
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
