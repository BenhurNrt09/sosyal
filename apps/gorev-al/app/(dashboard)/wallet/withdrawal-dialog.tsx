"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@repo/ui/src/components/ui/button";
import { Input } from "@repo/ui/src/components/ui/input";
import { Label } from "@repo/ui/src/components/ui/label";
import { createWithdrawalRequest } from "@/actions/withdrawal";

interface WithdrawalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
}

export function WithdrawalDialog({ isOpen, onClose, balance }: WithdrawalDialogProps) {
    const [amount, setAmount] = useState("");
    const [iban, setIban] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("amount", amount);
        formData.append("iban", iban);
        formData.append("bankName", bankName);
        formData.append("accountHolderName", accountHolderName);

        const result = await createWithdrawalRequest(formData);

        setIsSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            // Reset form
            setAmount("");
            setIban("");
            setBankName("");
            setAccountHolderName("");
            onClose();
        }
    };

    const formatIBAN = (value: string) => {
        // Remove all non-alphanumeric characters
        const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        // Add spaces every 4 characters
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substring(0, 32); // Max 26 chars + 6 spaces = 32
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-lg w-full shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900">Para Çekme Talebi</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    <div>
                        <Label className="text-sm font-bold text-slate-700 mb-2">Çekilecek Miktar (₺)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max={balance}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="rounded-xl border-slate-200 focus:ring-violet-500 text-lg font-bold"
                            placeholder="0.00"
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">Mevcut Bakiye: {balance.toFixed(2)}₺</p>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-slate-700 mb-2">Ad Soyad (Hesap Sahibi)</Label>
                        <Input
                            type="text"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value.toUpperCase())}
                            className="rounded-xl border-slate-200 focus:ring-violet-500 uppercase"
                            placeholder="AD SOYAD"
                            required
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-slate-700 mb-2">IBAN</Label>
                        <Input
                            type="text"
                            value={iban}
                            onChange={(e) => setIban(formatIBAN(e.target.value))}
                            className="rounded-xl border-slate-200 focus:ring-violet-500 font-mono"
                            placeholder="TR00 0000 0000 0000 0000 0000 00"
                            required
                        />
                    </div>

                    <div>
                        <Label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Banka Seçimi</Label>
                        <div className="relative group">
                            <select
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full h-14 px-4 rounded-xl border border-slate-100 bg-slate-50/50 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-sm cursor-pointer hover:border-violet-200"
                                required
                            >
                                <option value="">BANKA SEÇİN</option>
                                <option value="Akbank">Akbank</option>
                                <option value="Denizbank">Denizbank</option>
                                <option value="Garanti BBVA">Garanti BBVA</option>
                                <option value="Halkbank">Halkbank</option>
                                <option value="İş Bankası">İş Bankası</option>
                                <option value="QNB Finansbank">QNB Finansbank</option>
                                <option value="TEB">TEB</option>
                                <option value="Vakıfbank">Vakıfbank</option>
                                <option value="Yapı Kredi">Yapı Kredi</option>
                                <option value="Ziraat Bankası">Ziraat Bankası</option>
                                <option value="Diğer">Diğer</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-violet-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gönderiliyor...
                                </>
                            ) : (
                                "Talep Gönder"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
