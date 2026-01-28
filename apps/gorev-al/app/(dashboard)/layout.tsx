"use client";

import { DashboardShell } from "@repo/ui/src/components/layout/dashboard-shell";
import { navItems } from "../../config/nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell appName="Parala" logoUrl="/logo-parala.jpg" navItems={navItems}>
            {children}
        </DashboardShell>
    );
}   
