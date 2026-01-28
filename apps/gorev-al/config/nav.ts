import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    Bell,
    User,
    CheckSquare,
    HelpCircle
} from "lucide-react";

export const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Yeni Görevler",
        href: "/tasks",
        icon: ListTodo,
    },
    {
        label: "Girdiğim Görevler",
        href: "/my-tasks",
        icon: CheckSquare,
    },
    {
        label: "Cüzdanım",
        href: "/wallet",
        icon: Wallet,
    },
    {
        label: "Bildirimler",
        href: "/notifications",
        icon: Bell,
    },
    {
        label: "Profil",
        href: "/profile",
        icon: User,
    },
    {
        label: "Destek",
        href: "/support",
        icon: HelpCircle,
    },
];
