"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { Activity, LogOut } from "lucide-react";

interface SidebarProps {
    appName: string;
    items: {
        label: string;
        href: string;
        icon: any;
    }[];
}

export function Sidebar({ appName, items }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white hidden md:flex flex-col border-r border-slate-100 font-sans h-screen">
            <div className="h-24 flex items-center px-6 gap-3 border-b border-transparent shrink-0">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
                    <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">SOSYAL</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                    : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                            )}
                        >
                            <item.icon
                                className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-violet-600")}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-50 shrink-0">
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-lg border-2 border-white shadow-sm">
                        K
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">Kullanıcı</div>
                        <button className="text-xs text-slate-400 hover:text-violet-600 flex items-center gap-1 font-semibold transition-colors mt-0.5">
                            <LogOut size={12} /> ÇIKIŞ YAP
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
