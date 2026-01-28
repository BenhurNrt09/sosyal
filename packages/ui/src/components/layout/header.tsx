"use client";

import { Bell } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
    title?: string;
    userResult?: any;
}

export function Header({ title = "Ana Sayfa" }: HeaderProps) {
    return (
        <header className="flex h-24 items-center justify-between px-8 bg-transparent pt-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 mb-1">{title}</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Hoş geldin, <span className="text-slate-900 dark:text-white font-bold">Kullanıcı</span></p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-slate-800 rounded-xl w-12 h-12">
                    <Bell className="h-6 w-6" />
                    {/* <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white" /> */}
                </Button>
            </div>
        </header>
    );
}
