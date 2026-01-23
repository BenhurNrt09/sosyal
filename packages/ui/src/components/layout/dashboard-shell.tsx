import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "../../lib/utils";

interface DashboardShellProps {
    children: React.ReactNode;
    appName: string;
    navItems: any[];
    title?: string;
}

export function DashboardShell({ children, appName, navItems, title }: DashboardShellProps) {
    return (
        <div className="flex min-h-screen bg-[#F5F7FA]">
            <Sidebar appName={appName} items={navItems} />
            <div className="flex flex-1 flex-col h-screen overflow-hidden">
                <Header title={title} />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
