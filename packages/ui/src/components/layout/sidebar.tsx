"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Activity, LogOut } from "lucide-react";
import { createClient } from "@repo/lib/src/supabase";
import { useState, useEffect } from "react";

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
    const router = useRouter();
    const [userName, setUserName] = useState("Kullanıcı");
    const [userInitial, setUserInitial] = useState("K");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        let userSubscription: any;
        let notificationSubscription: any;

        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Initial Fetch
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("name, username, role")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    const displayName = profile.username || profile.name || user.email?.split('@')[0] || "Kullanıcı";
                    setUserName(displayName);
                    setUserInitial(displayName.charAt(0).toUpperCase());
                    setIsAdmin(profile.role === 'admin');
                }

                const { count } = await supabase
                    .from("notifications")
                    .select("*", { count: 'exact', head: true })
                    .eq("user_id", user.id)
                    .eq("is_read", false);

                setUnreadCount(count || 0);

                // Realtime for Profile
                userSubscription = supabase
                    .channel('profile_changes')
                    .on('postgres_changes', {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`
                    }, (payload) => {
                        const newProfile = payload.new as any;
                        const displayName = newProfile.username || newProfile.name || user.email?.split('@')[0] || "Kullanıcı";
                        setUserName(displayName);
                        setUserInitial(displayName.charAt(0).toUpperCase());
                        setIsAdmin(newProfile.role === 'admin');
                    })
                    .subscribe();

                // Realtime for Notifications
                notificationSubscription = supabase
                    .channel('notification_changes')
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    }, async () => {
                        const { count } = await supabase
                            .from("notifications")
                            .select("*", { count: 'exact', head: true })
                            .eq("user_id", user.id)
                            .eq("is_read", false);
                        setUnreadCount(count || 0);
                    })
                    .subscribe();
            }
        }

        fetchData();

        return () => {
            if (userSubscription) supabase.removeChannel(userSubscription);
            if (notificationSubscription) supabase.removeChannel(notificationSubscription);
        };
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 hidden md:flex flex-col border-r border-slate-100 dark:border-slate-800 font-sans h-screen">
            <div className="h-24 flex items-center px-6 gap-3 border-b border-transparent shrink-0">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">SOSYAL</span>
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
                            {item.label === "Bildirimler" && unreadCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-50 dark:border-slate-800 shrink-0">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-lg border-2 border-white dark:border-slate-700 shadow-sm">
                        {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</div>
                            {isAdmin && (
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                                    ADMİN
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 font-semibold transition-colors mt-0.5"
                        >
                            <LogOut size={12} /> ÇIKIŞ YAP
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
