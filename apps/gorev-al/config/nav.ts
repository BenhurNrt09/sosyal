import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    Bell,
    HelpCircle,
    User
} from "lucide-react";

export const navItems = [
    {
        label: "Panel",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Görevlerim",
        href: "/dashboard/tasks",
        icon: ListTodo,
    },
    {
        label: "Cüzdanım",
        href: "/dashboard/wallet",
        icon: Wallet,
    },
    {
        label: "Bildirimler",
        href: "/dashboard/notifications",
        icon: Bell,
    },
    {
        label: "Destek",
        href: "/dashboard/support",
        icon: HelpCircle,
    },
    {
        label: "Profil",
        href: "/dashboard/profile",
        icon: User,
    },
];
