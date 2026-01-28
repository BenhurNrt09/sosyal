"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CardData {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
}

export function CreditCard3D({ data, isFlipped }: { data: CardData; isFlipped: boolean }) {
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
        <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
            <motion.div
                className="relative w-full h-56"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front of Card */}
                <div
                    className="absolute w-full h-full rounded-2xl p-6 shadow-2xl"
                    style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                >
                    <div className="flex flex-col h-full justify-between text-white">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-10 rounded bg-gradient-to-br from-yellow-400 to-orange-400 opacity-80" />
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-red-500 opacity-70" />
                                <div className="w-8 h-8 rounded-full bg-orange-400 opacity-70 -ml-3" />
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-xl tracking-widest mb-4">
                                {formatCardNumber(data.number) || "#### #### #### ####"}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs opacity-70 mb-1">Card Holder</div>
                                    <div className="font-medium text-sm uppercase">
                                        {data.name || "Ad Soyad"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-70 mb-1">Expires</div>
                                    <div className="font-medium text-sm">{formatExpiry(data.expiry) || "MM/YY"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div
                    className="absolute w-full h-full rounded-2xl shadow-2xl"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                >
                    <div className="flex flex-col h-full">
                        <div className="w-full h-12 bg-black mt-6" />
                        <div className="px-6 mt-6">
                            <div className="bg-white h-10 rounded flex items-center justify-end px-4">
                                <span className="font-mono text-lg tracking-wider text-slate-800">
                                    {data.cvv || "***"}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 mt-auto mb-6">
                            <div className="text-white text-xs opacity-70">
                                Bu kart sahibine aittir. Bulunduğu takdirde lütfen bankaya iade ediniz.
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
