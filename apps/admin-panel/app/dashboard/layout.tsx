"use client";

import { DashboardShell } from "@repo/ui";
import { navItems } from "../../config/nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell
            appName="Admin Panel"
            navItems={navItems}
            title="Yönetim Paneli"
            className="bg-[#F5F7FA] dark:bg-slate-950 dark:text-slate-50"
        >
            {children}
        </DashboardShell>
    );
}
