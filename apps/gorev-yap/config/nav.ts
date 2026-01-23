import {
    LayoutDashboard,
    ListTodo,
    Wallet,
    Bell,
    User
} from "lucide-react";

export const navItems = [
    {
        label: "Ana Sayfa",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Görevlerim",
        href: "/tasks",
        icon: ListTodo,
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
        icon: User, // Destek ikonu eklenebilir
    },
];
