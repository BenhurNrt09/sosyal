import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    Bell,
    User,
    Eye,
    HelpCircle
} from "lucide-react";

export const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Görevlerim",
        href: "/tasks",
        icon: ListTodo,
    },
    {
        label: "Kanıt Onaylama",
        href: "/tasks/submissions",
        icon: Eye,
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
