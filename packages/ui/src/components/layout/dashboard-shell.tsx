import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "../../lib/utils";

interface DashboardShellProps {
    children: React.ReactNode;
    appName: string;
    logoUrl?: string;
    navItems: any[];
    title?: string;
    className?: string;
}

export function DashboardShell({ children, appName, logoUrl, navItems, title, className }: DashboardShellProps) {
    return (
        <div className={cn("flex min-h-screen bg-[#F5F7FA]", className)}>
            <Sidebar appName={appName} logoUrl={logoUrl} items={navItems} />
            <div className="flex flex-1 flex-col h-screen overflow-hidden">
                <Header title={title} />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
