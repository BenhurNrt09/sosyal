import { DashboardShell } from "@repo/ui/components/layout/dashboard-shell";
import { navItems } from "../../config/nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell appName="Yönetim" navItems={navItems} title="Yönetim Paneli">
            {children}
        </DashboardShell>
    );
}
