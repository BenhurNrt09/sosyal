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
                    setUserResult({ name: user.email?.split('@')[0], role: 'user', error: profileError.message });
                } else {
                    setUserResult(profile || { name: user.email?.split('@')[0], role: 'user' });
                }
            }
        }
        fetchUser();
    }, []);

    return (
        <div className={cn("flex min-h-screen bg-[#F5F7FA]", className)}>
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
