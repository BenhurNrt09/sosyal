import {
    LayoutDashboard,
    Users,
    ListTodo,
    Wallet,
    ShieldAlert,
    Settings
} from "lucide-react";

export const navItems = [
    {
        label: "Genel Bakış",
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
        label: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
];
