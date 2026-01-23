"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    Bell,
    HelpCircle,
    User,
    LogOut
} from "lucide-react";

interface SidebarProps {
    appName: string;
    items: {
        label: string;
        href: string;
        icon: React.ElementType;
    }[];
}

export function Sidebar({ appName, items }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white text-slate-800">
            <div className="flex h-20 items-center gap-2 border-b px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <span className="font-bold tracking-tight">{appName.toUpperCase()}</span>
            </div>

            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {items.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-all",
                                    isActive
                                        ? "bg-primary text-white shadow-md hover:bg-primary/90"
                                        : "text-slate-500 hover:text-primary hover:bg-slate-50"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-primary font-bold">
                        U
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">Kullanıcı</p>
                        <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500">
                            <LogOut className="h-3 w-3" /> Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
