"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
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
    const [isSuccess, setIsSuccess] = useState(false);

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
            setIsSuccess(true);
            // Reset form
            setAmount("");
            setIban("");
            setBankName("");
            setAccountHolderName("");
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
        }
    };

    const formatIBAN = (value: string) => {
        const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substring(0, 32);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-8 border-b border-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PARA ÇEKME TALEBİ</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">GÜVENLİ ÖDEME SİSTEMİ</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-8">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase">TALEBİNİZ ALINDI!</h3>
                            <p className="text-slate-500 font-medium max-w-xs">
                                Para çekme talebiniz incelendikten sonra hesabınıza aktarılacaktır.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <Label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Çekilecek Miktar (₺)</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={balance}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-orange-500 text-xl font-black h-14"
                                        placeholder="0.00"
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        Mevcut: {balance.toFixed(2)}₺
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <Label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Ad Soyad (Hesap Sahibi)</Label>
                                    <Input
                                        type="text"
                                        value={accountHolderName}
                                        onChange={(e) => setAccountHolderName(e.target.value.toUpperCase())}
                                        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-orange-500 uppercase font-bold h-12"
                                        placeholder="AD SOYAD"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">IBAN</Label>
                                    <Input
                                        type="text"
                                        value={iban}
                                        onChange={(e) => setIban(formatIBAN(e.target.value))}
                                        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-orange-500 font-mono text-center tracking-wider h-12"
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
                                            className="w-full h-14 px-4 rounded-xl border border-slate-100 bg-slate-50/50 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-sm cursor-pointer hover:border-orange-200"
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
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-orange-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    onClick={onClose}
                                    variant="ghost"
                                    className="flex-1 rounded-2xl h-14 font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                >
                                    İPTAL
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-2xl h-14 font-black shadow-xl shadow-orange-100 active:scale-[0.98] transition-all px-12"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "TALEP GÖNDER"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
