import { DashboardShell } from "@repo/ui/components/layout/dashboard-shell";
import { navItems } from "../../config/nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell appName="Görevyap" navItems={navItems}>
            {children}
        </DashboardShell>
    );
}
