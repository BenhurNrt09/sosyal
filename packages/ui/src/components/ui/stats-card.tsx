import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface StatsCardProps {
    label: string;
    value: string;
    icon: React.ElementType;
    colorClass?: string;
}

export function StatsCard({ label, value, icon: Icon, colorClass = "bg-primary/10 text-primary" }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm">
            <div className="flex items-start justify-between">
                <div>
                    <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl", colorClass)}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                </div>
            </div>
        </div>
    );
}
