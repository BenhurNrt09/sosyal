"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Activity, LogOut } from "lucide-react";
import { createClient } from "@repo/lib/src/supabase";
import { useState, useEffect } from "react";

interface SidebarProps {
    appName: string;
    logoUrl?: string; // New prop for image logo
    items: {
        label: string;
        href: string;
        icon: any;
    }[];
    userResult?: any;
}

export function Sidebar({ appName, logoUrl, items, userResult }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState("Kullanıcı");
    const [userInitial, setUserInitial] = useState("K");
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (userResult) {
            const displayName = userResult.name || userResult.username || "Kullanıcı";
            setUserName(displayName);
            setUserInitial(displayName.charAt(0).toUpperCase());
            setIsAdmin(userResult.role === 'admin');
        }
    }, [userResult]);

    useEffect(() => {
        const supabase = createClient();
        let userSubscription: any;
        let notificationSubscription: any;

        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Only fetch if userResult is not provided by parent
                if (!userResult) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("name, username, role")
                        .eq("id", user.id)
                        .single();

                    if (profile) {
                        const displayName = profile.name || profile.username || user.email?.split('@')[0] || "Kullanıcı";
                        setUserName(displayName);
                        setUserInitial(displayName.charAt(0).toUpperCase());
                        setIsAdmin(profile.role === 'admin');
                    } else {
                        // Fallback name from email if profile check fails
                        const fallbackName = user.email?.split('@')[0] || "Kullanıcı";
                        setUserName(fallbackName);
                        setUserInitial(fallbackName.charAt(0).toUpperCase());
                        setIsAdmin(false);
                    }
                }

                const { count } = await supabase
                    .from("notifications")
                    .select("*", { count: 'exact', head: true })
                    .eq("user_id", user.id)
                    .eq("is_read", false);

                setUnreadCount(count || 0);

                // Realtime for Profile (only if userResult is not provided, otherwise parent handles updates)
                if (!userResult) {
                    userSubscription = supabase
                        .channel('profile_changes')
                        .on('postgres_changes', {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `id=eq.${user.id}`
                        }, (payload) => {
                            const newProfile = payload.new as any;
                            const displayName = newProfile.name || newProfile.username || user.email?.split('@')[0] || "Kullanıcı";
                            setUserName(displayName);
                            setUserInitial(displayName.charAt(0).toUpperCase());
                            setIsAdmin(newProfile.role === 'admin');
                        })
                        .subscribe();
                }

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

        const handleUpdate = () => fetchData();
        window.addEventListener('notifications-updated', handleUpdate);

        return () => {
            if (userSubscription) supabase.removeChannel(userSubscription);
            if (notificationSubscription) supabase.removeChannel(notificationSubscription);
            window.removeEventListener('notifications-updated', handleUpdate);
        };
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        // Force a full page reload to the root to clear all local/client state
        window.location.href = "/";
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 hidden md:flex flex-col border-r border-slate-100 dark:border-slate-800 font-sans h-screen">
            <div className="h-24 flex items-center px-6 gap-3 border-b border-transparent shrink-0">
                {logoUrl ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                        <img src={logoUrl} alt={appName} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
                    </div>
                )}
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{appName}</span>
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
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors"
                            )}
                        >
                            <item.icon
                                className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")}
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
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg border-2 border-white dark:border-slate-700 shadow-sm">
                        {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "text-sm font-bold truncate",
                                appName === "DİJİTAL HAVUZ" ? "text-orange-500" : "text-primary"
                            )}>{userName}</div>
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
