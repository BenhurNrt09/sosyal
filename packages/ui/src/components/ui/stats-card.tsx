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
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl", colorClass)}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
                </div>
            </div>
        </div>
    );
}
