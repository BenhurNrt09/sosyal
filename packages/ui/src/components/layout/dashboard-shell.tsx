"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "../../lib/utils";
import { createClient } from "@repo/lib/src/supabase";

interface DashboardShellProps {
    children: React.ReactNode;
    appName: string;
    logoUrl?: string;
    navItems: any[];
    title?: string;
    className?: string;
}

export function DashboardShell({ children, appName, logoUrl, navItems, title, className }: DashboardShellProps) {
    const [userResult, setUserResult] = useState<any>(null);

    useEffect(() => {
        const supabase = createClient();
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profileError) {
                    console.error("DashboardShell Profile Fetch Error:", profileError);
                    // Fallback to email prefix but keep role as user
                    const displayName = user.email?.split('@')[0] || "Kullanıcı";
                    setUserResult({ name: displayName, username: displayName, role: 'user', error: profileError.message });
                } else {
                    const result = profile || { name: user.email?.split('@')[0], role: 'user' };
                    setUserResult(result);

                    // SECURITY CHECKS
                    if (appName === "Admin Panel" && result.role !== 'admin') {
                        // 1. Non-admin trying to access Admin Panel
                        console.warn("Security Check: Non-admin user attempted to access Admin Panel. Redirecting...");
                        setTimeout(() => {
                            window.location.href = "/login?error=unauthorized";
                        }, 500);
                    }
                }
            } else {
                // No session
                if (appName === "Admin Panel") {
                    window.location.href = "/login";
                }
            }
        }
        fetchUser();
    }, [appName]);

    return (
        <div className={cn("flex min-h-screen bg-[#F5F7FA] dark:bg-slate-950", className)}>
            <Sidebar appName={appName} logoUrl={logoUrl} items={navItems} userResult={userResult} />
            <div className="flex flex-1 flex-col h-screen overflow-hidden">
                <Header title={title} userResult={userResult} />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
