"use client";

import { DashboardShell } from "@repo/ui/src/components/layout/dashboard-shell";
import { navItems } from "../../config/nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell appName="Dijital Havuz" navItems={navItems}>
            {children}
        </DashboardShell>
    );
}
