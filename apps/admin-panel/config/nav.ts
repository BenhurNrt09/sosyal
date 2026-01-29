import {
    LayoutDashboard,
    Users,
    ListTodo,
    Wallet,
    ShieldAlert,
    Settings,
    CheckCircle,
    HelpCircle,
    Bell
} from "lucide-react";

export const navItems = [
    {
        label: "Panel",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Kullanıcılar",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        label: "Görevler",
        href: "/dashboard/tasks",
        icon: ListTodo,
    },
    {
        label: "Başvurular & Kanıtlar",
        href: "/dashboard/submissions",
        icon: CheckCircle,
    },
    {
        label: "Finans",
        href: "/dashboard/finance",
        icon: Wallet,
    },
    {
        label: "Moderasyon",
        href: "/dashboard/moderation",
        icon: ShieldAlert,
    },
    {
        label: "Destek",
        href: "/dashboard/support",
        icon: HelpCircle,
    },
    {
        label: "Bildirimler",
        href: "/dashboard/notifications",
        icon: Bell,
    },
    {
        label: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
];
