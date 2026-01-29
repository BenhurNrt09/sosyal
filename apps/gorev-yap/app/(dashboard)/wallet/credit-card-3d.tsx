"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardData {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
}

export function CreditCard3D({ data, isFlipped }: { data: CardData; isFlipped: boolean }) {
    const getCardType = (number: string) => {
        if (!number) return "generic";
        if (number.startsWith("4")) return "visa";
        if (number.startsWith("5")) return "mastercard";
        if (number.startsWith("9")) return "troy";
        if (number.startsWith("3")) return "amex";
        return "generic";
    };

    const cardType = getCardType(data.number);

    const formatCardNumber = (num: string) => {
        const cleaned = num.replace(/\s/g, "");
        const groups = cleaned.match(/.{1,4}/g) || [];
        return groups.join(" ").substring(0, 19);
    };

    const formatExpiry = (exp: string) => {
        const cleaned = exp.replace(/\D/g, "");
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    return (
        <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1500px" }}>
            <motion.div
                className="relative w-full h-64 lg:h-72"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front of Card */}
                <div
                    className="absolute w-full h-full rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20"
                    style={{
                        backfaceVisibility: "hidden",
                        background: cardType === "visa"
                            ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
                            : cardType === "mastercard"
                                ? "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)"
                                : cardType === "troy"
                                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                                    : "linear-gradient(135deg, #ea580c 0%, #f97316 100%)", // Orange for Dijital Havuz
                    }}
                >
                    <div className="flex flex-col h-full justify-between text-white">
                        <div className="flex justify-between items-start">
                            <div className="relative">
                                <div className="w-14 h-11 rounded-lg bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-lg border border-white/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-[1px] bg-black/10 transform rotate-12" />
                                    <div className="w-full h-[1px] bg-black/10 transform -rotate-12" />
                                </div>
                            </div>

                            <div className="h-10 flex items-center">
                                <AnimatePresence mode="wait">
                                    {cardType === "visa" && (
                                        <motion.div
                                            key="visa"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="text-2xl font-black italic tracking-tighter"
                                        >
                                            VISA
                                        </motion.div>
                                    )}
                                    {cardType === "mastercard" && (
                                        <motion.div
                                            key="mc"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-500/90 shadow-lg" />
                                            <div className="w-8 h-8 rounded-full bg-orange-500/90 -ml-3 shadow-lg" />
                                        </motion.div>
                                    )}
                                    {cardType === "troy" && (
                                        <motion.div
                                            key="troy"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="text-xl font-black tracking-[0.2em]"
                                        >
                                            TROY
                                        </motion.div>
                                    )}
                                    {cardType === "generic" && (
                                        <motion.div
                                            key="generic"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.5 }}
                                            className="w-8 h-8 rounded-full border-2 border-dashed border-white"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div>
                            <div className="font-mono text-2xl lg:text-3xl tracking-[0.15em] mb-8 font-black drop-shadow-md">
                                {formatCardNumber(data.number) || "•••• •••• •••• ••••"}
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="flex-1 mr-4">
                                    <div className="text-[10px] font-black opacity-50 mb-1 uppercase tracking-widest">Kart Sahibi</div>
                                    <div className="font-black text-sm lg:text-base uppercase truncate drop-shadow-sm">
                                        {data.name || "AD SOYAD"}
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <div className="text-[10px] font-black opacity-50 mb-1 uppercase tracking-widest">SKT</div>
                                    <div className="font-black text-sm lg:text-base drop-shadow-sm text-right">
                                        {formatExpiry(data.expiry) || "MM/YY"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute w-full h-full rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
                    }}
                >
                    <div className="flex flex-col h-full pt-10">
                        <div className="w-full h-14 lg:h-16 bg-black shadow-inner" />
                        <div className="px-10 mt-10">
                            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 text-right mr-2">GÜVENLİK KODU</div>
                            <div className="relative">
                                <div className="bg-slate-100 h-12 rounded-xl flex items-center justify-end px-6 shadow-inner overflow-hidden">
                                    <div className="absolute left-0 right-12 h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)]" />
                                    <span className="font-mono text-xl font-black tracking-[0.3em] text-slate-800 relative z-10 italic">
                                        {data.cvv || "•••"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-10 mt-auto mb-10 text-center">
                            <div className="text-white/20 text-[9px] font-medium leading-relaxed uppercase tracking-tighter">
                                Bu kart kişiye özeldir. Lütfen başkalarıyla paylaşmayınız.
                                <br />
                                Bulunduğunda ilgili bankaya iade edilmesi rica olunur.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
