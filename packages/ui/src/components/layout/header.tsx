"use client";

import { Bell } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
    title?: string;
    userResult?: any;
}

export function Header({ title = "Ana Sayfa", userResult }: HeaderProps) {
    const userDisplayName = userResult?.name || userResult?.username || (userResult?.role === 'admin' ? "Sistem Yöneticisi" : "Kullanıcı");

    return (
        <header className="flex h-24 items-center justify-between px-8 bg-transparent pt-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-1">{title}</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Hoş geldin, <span className="text-slate-900 dark:text-white font-bold">{userDisplayName}</span></p>
            </div>
            <div className="flex items-center gap-4">
                {/* Notification bell removed */}
            </div>
        </header>
    );
}
