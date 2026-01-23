import {
    LayoutDashboard,
    PlusCircle,
    ListTodo,
    Wallet,
    Bell,
    Settings,
    User
} from "lucide-react";

export const navItems = [
    {
        label: "Panel",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Görev Ver",
        href: "/dashboard/tasks/new",
        icon: PlusCircle,
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
        label: "Ayarlar",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        label: "Profil",
        href: "/dashboard/profile",
        icon: User,
    },
];
