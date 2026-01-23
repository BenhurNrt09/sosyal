"use client";

import { Bell } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
    title: string;
    userResult?: any;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500">Hoş geldin, Kullanıcı</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary">
                    <Bell className="h-6 w-6" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>
            </div>
        </header>
    );
}
